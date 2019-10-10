const fetchJSON = require("./util/fetch-json");

class Signaler {
  constructor() {
    this._url = "";
    this._headers = {};

    this._pingPongTimer = null;
  }

  get attrsForTest() {
    return {
      url: this._url,
      headers: { ...this._headers }
    };
  }

  setUrl(url) {
    this._url = url;
    return this;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this;
  }

  async initialize(params) {
    const res = await fetchJSON(
      "POST",
      `${this._url}/initialize`,
      this._headers,
      params
    );
    return res.data;
  }

  async connect(params) {
    const res = await fetchJSON(
      "POST",
      `${this._url}/transport/connect`,
      this._headers,
      params
    );
    return res.data;
  }

  async produce(params) {
    const res = await fetchJSON(
      "POST",
      `${this._url}/transport/produce`,
      this._headers,
      params
    );
    return res.data;
  }

  async start(params, intervalMs) {
    const res = await fetchJSON(
      "POST",
      `${this._url}/record/start`,
      this._headers,
      params
    );
    this._pingPongTimer = setInterval(
      () => fetchJSON("GET", `${this._url}/record/ping`, this._headers),
      intervalMs
    );
    return res.data;
  }

  async stop() {
    clearInterval(this._pingPongTimer);
    const res = await fetchJSON(
      "POST",
      `${this._url}/record/stop`,
      this._headers,
      {}
    );
    return res.data;
  }
}

module.exports = Signaler;
