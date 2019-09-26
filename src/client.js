import EventEmitter from "eventemitter3";

const pingPongInterval = 1000 * 15; // 15sec

export default class Recorder extends EventEmitter {
  constructor({ device, signaling }) {
    super();

    this._device = device;
    this._signaling = signaling;

    this._state = "new";
    this._transport = null;
    this._pingPongTimer = null;
  }

  async _setupTransport({ transportInfo }) {
    if (this._transport !== null) return;

    // TODO: STUN/TURN
    // transportInfo.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
    this._transport = this._device.createSendTransport(transportInfo);

    this._transport.once(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this._signaling.connect({ dtlsParameters });
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
          const { id } = await this._signaling.produce({ kind, rtpParameters });
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

  async start(track) {
    if (!track) throw new Error("TODO");
    if (track.kind !== "audio") throw new Error("TODO");
    if (this._state !== "new") throw new Error("TODO: can not reuse");

    this._state = "recording";

    this._producer = await this._transport.produce({ track });

    this._producer.once("transportclose", () => {
      this.stop();
      this.emit("abort", { reason: "Transport closed." });
    });
    this._producer.once("trackended", () => {
      this.stop();
      this.emit("abort", { reason: "Track ended." });
    });

    const res = await this._signaling.start({ producerId: this._producer.id });
    this._pingPongTimer = setInterval(
      () => this._signaling.ping(),
      pingPongInterval
    );

    return res;
  }

  async stop() {
    if (this._state !== "recording") return;

    this._state = "closed";

    this._producer.close();
    this._transport.close();

    clearInterval(this._pingPongTimer);
    await this._signaling.stop();
  }
}
