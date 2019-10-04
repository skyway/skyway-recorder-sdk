const pingPongInterval = 1000 * 15; // 15sec

export default class Signaling {
  constructor(rest) {
    this._rest = rest;
    this._pingPongTimer = null;
  }

  async initialize(params) {
    const res = await this._rest.postJSON("/initialize", params);
    return res;
  }

  async connect(params) {
    const res = await this._rest.postJSON("/transport/connect", params);
    return res;
  }

  async produce(params) {
    const res = await this._rest.postJSON("/transport/produce", params);
    return res;
  }

  async start(params) {
    const res = await this._rest.postJSON("/record/start", params);

    this._pingPongTimer = setInterval(() => this._ping(), pingPongInterval);

    return res;
  }

  async stop() {
    clearInterval(this._pingPongTimer);
    const res = await this._rest.postJSON("/record/stop", {});
    return res;
  }

  async _ping() {
    const res = await this._rest.getJSON("/record/ping");
    return res;
  }
}
