const debug = require("debug")("skyway-recorder:client");
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
const { InvalidStateError, AbortError } = require("./../errors");

const PING_INTERVAL = 15 * 1000; // 15 seconds

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

  get state() {
    return this._state;
  }

  async start(track) {
    debug("start()", track);
    if (!track) throw new TypeError("Audio track is missing!");
    if (track.kind !== "audio")
      throw new TypeError("Recording video track is not supported!");
    if (this._state !== "new")
      throw new InvalidStateError(
        "Already started! you need another recorder for new recording."
      );

    const { routerRtpCapabilities, transportInfo } = await initializeSession({
      signaler: this._signaler,
      authParams: this._authParams,
      iceServers: this._iceServers,
      iceTransportPolicy: this._iceTransportPolicy
    });
    debug("session initialized");

    const device = await createDevice({ routerRtpCapabilities });
    debug("device created");

    this._transport = createTransportAndBindEvents({
      device,
      transportInfo,
      signaler: this._signaler,
      onAbort: reason => {
        debug("aborted by", reason);
        this.stop();
        this.emit("abort", new AbortError(reason));
      }
    });
    debug("transport created");

    this._producer = await createProducerAndBindEvents({
      transport: this._transport,
      track,
      onAbort: reason => {
        debug("aborted by", reason);
        this.stop();
        this.emit("abort", new AbortError(reason));
      }
    });
    debug("producer created");

    const { id, stopPingTimer } = await startRecording({
      signaler: this._signaler,
      producerId: this._producer.id,
      pingInterval: PING_INTERVAL
    });
    debug("record started w/ id", id);

    this._stopPingTimer = stopPingTimer;
    this._state = "recording";

    return { id };
  }

  async stop() {
    debug("stop()");
    if (this._state === "closed")
      throw new InvalidStateError("Already closed!");
    if (this._state !== "recording")
      throw new InvalidStateError("Recorder not yet started!");

    this._state = "closed";

    closeTransport({ producer: this._producer, transport: this._transport });
    await stopRecording({
      signaler: this._signaler,
      stopPingTimer: this._stopPingTimer
    }).catch(err => {
      // if network problem causes abort, here also throws but nothing to do
      // even in normal case, ping-pong timeout will work to stop recording
      debug(err);
    });
    debug("record stopped");
  }
}

module.exports = Client;
