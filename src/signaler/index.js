const fetchJSON = require("./fetch-json");

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

  setHeader(key, value) {
    this._headers[key] = value;
    return this;
  }

  async request(method, path, params) {
    // TODO: may rejects with failed to fetch by no-network
    const res = await fetchJSON(
      method,
      this._url + path,
      this._headers,
      params
    );

    if (res.status !== 200) {
      // TODO: should throw? or be handled by caller?
    }

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
