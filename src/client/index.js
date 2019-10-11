const EventEmitter = require("eventemitter3");
const {
  initializeSession,
  createDevice,
  createTransportAndBindEvents,
  createProducerAndBindEvents,
  startRecording,
  closeTransport,
  stopRecording
} = require("./usecase");

class Client extends EventEmitter {
  constructor(signaler, { auth, iceServers, iceTransportPolicy }) {
    super();

    this._signaler = signaler;
    this._authParams = auth;
    this._iceServers = iceServers;
    this._iceTransportPolicy = iceTransportPolicy;

    this._state = "new";
    this._transport = null;
    this._producer = null;
    this._stopPingTimer = () => {};
  }

  async start(track) {
    if (!track) throw new Error("Track is missing!");
    if (track.kind !== "audio")
      throw new Error("Recording video track is not supported!");
    if (this._state !== "new") throw new Error("Already started!");

    const { routerRtpCapabilities, transportInfo } = await initializeSession({
      signaler: this._signaler,
      authParams: this._authParams,
      iceServers: this._iceServers,
      iceTransportPolicy: this._iceTransportPolicy
    });

    const device = await createDevice({ routerRtpCapabilities });

    this._transport = createTransportAndBindEvents({
      device,
      transportInfo,
      signaler: this._signaler,
      onAbort: reason => {
        this.stop();
        this.emit("abort", { reason });
      }
    });

    this._producer = await createProducerAndBindEvents({
      transport: this._transport,
      track,
      onAbort: reason => {
        this.stop();
        this.emit("abort", { reason });
      }
    });

    const { id, stopPingTimer } = startRecording({
      signaler: this._signaler,
      producerId: this._producer.id,
      pingInterval: 1000 * 10 // 10 sec
    });

    this._stopPingTimer = stopPingTimer;
    this._state = "recording";

    return id;
  }

  async stop() {
    if (this._state !== "recording") throw new Error("Not yet started");

    this._state = "closed";

    closeTransport({ producer: this._producer, transport: this._transport });
    await stopRecording({
      signaler: this._signaler,
      stopPingTimer: this._stopPingTimer
    });
  }
}

module.exports = Client;
