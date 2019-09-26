// TODO: extends EventEmitter to notify transport close?
export default class Recorder {
  constructor({ device, signaling }) {
    this._device = device;
    this._signaling = signaling;

    this._state = "new";
    this._transport = null;
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

    this._transport.on("connectionstatechange", state => {
      console.warn("connState", state);
      if (state === "disconnected") {
        // TODO: emit(stop)
      }
    });
  }

  async start(track) {
    if (!track) throw new Error("TODO");
    if (track.kind !== "audio") throw new Error("TODO");
    if (!this._device.canProduce("audio")) throw new Error("TODO");
    if (this._state !== "new") throw new Error("TODO: can not reuse");

    this._state = "recording";

    this._producer = await this._transport.produce({ track });
    const res = await this._signaling.start({ producerId: this._producer.id });

    this._producer.on("transportclose", () => {
      // TODO: emit(stop);
      console.warn("transportclose");
    });
    this._producer.on("trackended", () => {
      // TODO: this.stop() and emit(stop);
      console.warn("trackended");
    });

    return res;
  }

  async stop() {
    if (this._state !== "recording") return;

    this._state = "closed";

    this._producer.close();
    this._transport.close();

    await this._signaling.stop();
  }
}
