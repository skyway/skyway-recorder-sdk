const fetchJSON = require("./fetch-json");
const { NetworkError, ResponseError } = require("../errors");

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

  async request(method, path, params) {
    // TODO: may rejects with failed to fetch by no-network
    const { status, data } = await fetchJSON(
      method,
      this._url + path,
      this._headers,
      params
    ).catch(err => {
      throw new NetworkError(err.message);
    });

    if (status !== 200) {
      throw new ResponseError(data.error);
    }

    return data;
  }

  startPing(method, path, intervalMs) {
    const pingPongTimer = setInterval(
      () => fetchJSON(method, this._url + path, this._headers).catch(() => {}),
      intervalMs
    );

    return () => clearInterval(pingPongTimer);
  }
}

module.exports = Signaler;
