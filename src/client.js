const EventEmitter = require("eventemitter3");
const {
  createDevice,
  createTransport,
  createProducer
} = require("./util/factory");

const pingPongInterval = 1000 * 10; // 15sec

class Client extends EventEmitter {
  constructor(signaler, { auth, iceServers, iceTransportPolicy }) {
    super();

    this._signaler = signaler;
    this._authParams = auth;
    this._iceServers = iceServers;
    this._iceTransportPolicy = iceTransportPolicy;

    this._state = "new";
    this._transport = null;
  }

  async start(track) {
    if (!track) throw new Error("TODO");
    if (track.kind !== "audio") throw new Error("TODO");
    if (this._state !== "new") throw new Error("TODO: can not reuse");

    const {
      routerRtpCapabilities,
      transportInfo
    } = await this._initializeSession();

    const device = await createDevice({ routerRtpCapabilities });

    if (!device.canProduce("audio")) throw new Error("TODO");

    this._transport = createTransport({
      device,
      transportInfo,
      iceServers: this._iceServers,
      iceTransportPolicy: this._iceTransportPolicy
    });
    this._handleTransportEvent();

    this._producer = await createProducer({
      transport: this._transport,
      track
    });
    this._handleProducerEvent();

    const { id } = await this._signaler.start(
      { producerId: this._producer.id },
      pingPongInterval
    );

    this._state = "recording";

    return id;
  }

  async stop() {
    if (this._state !== "recording") throw new Error("Not yet started");

    this._state = "closed";

    this._producer.close();
    this._transport.close();

    await this._signaler.stop();
  }

  async _initializeSession() {
    const {
      fqdn,
      sessionToken,
      routerRtpCapabilities,
      transportInfo
    } = await this._signaler.initialize(this._authParams || {});

    // update
    this._signaler.setUrl(fqdn);
    this._signaler.addHeader("X-Session-Token", sessionToken);

    return { routerRtpCapabilities, transportInfo };
  }

  async _handleTransportEvent() {
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

  async _handleProducerEvent() {
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
