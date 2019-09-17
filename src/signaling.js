import Rest from "./rest";

export default class Signaling {
  constructor(baseUrl, headers) {
    this._rest = new Rest(baseUrl, headers);
  }

  async initialize(apiKey, credential) {
    const res = await this._rest.postJSON("/initialize", {
      apiKey,
      credential
    });

    // TODO: then(res => res.error)
    // TODO: catch()
    return res;
  }

  async connect(params) {
    const res = await this._rest.postJSON("/transport/connect", params);
    // TODO: then(res => res.error)
    // TODO: catch()
    return res;
  }

  async produce(params) {
    const res = await this._rest.postJSON("/transport/produce", params);
    // TODO: then(res => res.error)
    // TODO: catch()
    return res;
  }

  async start(params) {
    const res = await this._rest.postJSON("/record/start", params);

    // TODO: then(res => res.error)
    // TODO: catch()
    return res;
  }
}
