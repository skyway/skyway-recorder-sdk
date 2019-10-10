const fetchJSON = require("./util/fetch-json");

class Signaler {
  constructor({ baseUrl, apiKey }) {
    this._url = baseUrl;
    this._headers = {
      "X-Api-Key": apiKey
    };

    this._pingPongTimer = null;
  }

  setUrl(url) {
    this._url = url;
  }

  addHeader(key, value) {
    this._headers[key] = value;
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
