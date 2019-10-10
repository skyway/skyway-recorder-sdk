const fetchJSON = require("./util/fetch-json");

class Signaler {
  constructor() {
    this._url = "";
    this._headers = {};

    this._pingPongTimer = null;
  }

  setUrl(url) {
    this._url = url;
    return this;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this;
  }

  async fetchJSON(method, path, params) {
    const res = await fetchJSON(
      method,
      this._url + path,
      this._headers,
      params
    );
    return res.data;
  }

  startPing(method, path, intervalMs) {
    const pingPongTimer = setInterval(
      () => fetchJSON(method, this._url + path, this._headers),
      intervalMs
    );

    return () => clearInterval(pingPongTimer);
  }
}

module.exports = Signaler;
