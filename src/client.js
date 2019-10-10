const EventEmitter = require("eventemitter3");
const { Device } = require("mediasoup-client");
const { pingPongInterval } = require("./util/constants");

const initializeSession = async ({ signaler, auth }) => {
  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await signaler.initialize({ auth });

  // update
  signaler.setUrl(fqdn);
  signaler.addHeader("X-Session-Token", sessionToken);

  return { routerRtpCapabilities, transportInfo };
};

const loadMediaSoupDevice = async ({ routerRtpCapabilities }) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities });

  if (!device.canProduce("audio")) throw new Error("TODO");

  return device;
};

class Client extends EventEmitter {
  constructor({ signaler, auth, iceServers, iceTransportPolicy }) {
    super();

    this._signaler = signaler;
    this._authParams = auth;
    this._iceConfiguration = { iceServers, iceTransportPolicy };

    this._state = "new";
    this._device = null;
    this._transport = null;
  }

  async start(track) {
    if (!track) throw new Error("TODO");
    if (track.kind !== "audio") throw new Error("TODO");
    if (this._state !== "new") throw new Error("TODO: can not reuse");

    const { routerRtpCapabilities, transportInfo } = await initializeSession({
      signaler: this._signaler,
      auth: this._authParams
    });

    this._state = "recording";

    this._device = await loadMediaSoupDevice({ routerRtpCapabilities });
    await this._setupTransport(transportInfo);
    await this._setupProducer(track);

    const res = await this._signaler.start(
      { producerId: this._producer.id },
      pingPongInterval
    );

    return res;
  }

  async stop() {
    if (this._state !== "recording") throw new Error("Not yet started");

    this._state = "closed";

    this._producer.close();
    this._transport.close();

    await this._signaler.stop();
  }

  async _setupTransport(transportInfo) {
    this._transport = this._device.createSendTransport(transportInfo);

    this._transport.once(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this._signaler.connect({ dtlsParameters });
          callback();
        } catch (err) {
          errback(err);
          // TODO: throw
        }
      }
    );

    this._transport.once(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          // server side producerId
          const { id } = await this._signaler.produce({ kind, rtpParameters });
          callback({ id });
        } catch (err) {
          errback(err);
          // TODO: throw
        }
      }
    );

    this._transport.on("connectionstatechange", async state => {
      if (state === "disconnected") {
        this.stop();
        this.emit("abort", { reason: "Disconnected from server." });
      }
    });
  }

  async _setupProducer(track) {
    this._producer = await this._transport.produce({ track });

    this._producer.once("transportclose", () => {
      this.stop();
      this.emit("abort", { reason: "Transport closed." });
    });
    this._producer.once("trackended", () => {
      this.stop();
      this.emit("abort", { reason: "Track ended." });
    });
  }
}

module.exports = Client;
