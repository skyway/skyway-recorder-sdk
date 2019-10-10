const EventEmitter = require("eventemitter3");
const {
  createDevice,
  createTransport,
  createProducer
} = require("./util/factory");

class Client extends EventEmitter {
  constructor(signaler, { auth, iceServers, iceTransportPolicy }) {
    super();

    this._signaler = signaler;
    this._authParams = auth;
    this._iceServers = iceServers;
    this._iceTransportPolicy = iceTransportPolicy;

    this._state = "new";
    this._transport = null;
    this._stopPingTimer = () => {};
  }

  async start(track) {
    if (!track) throw new Error("Track is missing!");
    if (track.kind !== "audio")
      throw new Error("Recording video track is not supported!");
    if (this._state !== "new") throw new Error("Already started!");

    const {
      routerRtpCapabilities,
      transportInfo
    } = await this._initializeSession();

    const device = await createDevice({ routerRtpCapabilities });

    this._transport = createTransport({ device, transportInfo });
    this._handleTransportEvent();

    this._producer = await createProducer({
      transport: this._transport,
      track
    });
    this._handleProducerEvent();

    const { id } = await this._signaler.fetchJSON(
      "POST",
      "/record/start",
      { producerId: this._producer.id },
      1000 * 10 // 10 sec
    );

    this._stopPingTimer = this._signaler.startPing(
      "GET",
      "/record/ping",
      1000 * 10
    );

    this._state = "recording";

    return id;
  }

  async stop() {
    if (this._state !== "recording") throw new Error("Not yet started");

    this._state = "closed";

    this._producer.close();
    this._transport.close();

    this._stopPingTimer();
    await this._signaler.fetchJSON("POST", "/record/stop", {});
  }

  async _initializeSession() {
    const {
      fqdn,
      sessionToken,
      routerRtpCapabilities,
      transportInfo
    } = await this._signaler.fetchJSON(
      "POST",
      "/initialize",
      this._authParams || {}
    );

    // update
    this._signaler.setUrl(fqdn).addHeader("X-Session-Token", sessionToken);

    // if passed, override even if it is empty
    if (this._iceServers) {
      transportInfo.iceServers = this._iceServers;
    }
    // will be passed `relay` or default `all`
    transportInfo.iceTransportPolicy = this._iceTransportPolicy;

    return { routerRtpCapabilities, transportInfo };
  }

  async _handleTransportEvent() {
    this._transport.once(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this._signaler.fetchJSON("POST", "/transport/connect", {
            dtlsParameters
          });
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
          const { id } = await this._signaler.fetchJSON(
            "POST",
            "/transport/produce",
            { kind, rtpParameters }
          );
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
