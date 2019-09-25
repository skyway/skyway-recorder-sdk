import Rest from "./rest";

// TODO: really need this...?
export default class Signaling {
  constructor(baseUrl, headers) {
    this._rest = new Rest(baseUrl, headers);
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
    return res;
  }

  async ping() {
    const res = await this._rest.postJSON("/record/ping", {});
    return res;
  }

  async stop() {
    const res = await this._rest.postJSON("/record/stop", {});
    return res;
  }
}
