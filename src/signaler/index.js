const debug = require("debug")("skyway-recorder:signaler");
const fetchJSON = require("./fetch-json");
const { ServerError, RequestError } = require("../errors");

class Signaler {
  constructor() {
    this._url = "";
    this._headers = {};
  }

  setUrl(url) {
    debug(`setUrl ${this._url} -> ${url}`);
    this._url = url;
    return this;
  }

  setHeader(key, value) {
    debug(`setHeader(${key}, ${value})`);
    this._headers[key] = value;
    return this;
  }

  async request(method, path, params) {
    debug("request()", method, path);
    // may throw NetworkError or ServerError
    const { status, data } = await fetchJSON(
      method,
      this._url + path,
      this._headers,
      params
    );

    // 200~299
    if (200 <= status && status < 300) return data;
    // 400~499
    if (400 <= status && status < 500)
      throw new RequestError(`${data.error}: ${data.message}`);
    // 100~199, 300~399, 500~
    throw new ServerError(data.error);
  }

  startPing(method, path, intervalMs) {
    const pingPongTimer = setInterval(() => {
      debug("send ping", method, path);
      fetchJSON(method, this._url + path, this._headers).catch(err => {
        // nothing to do when ping fails, no retry, no alerts
        debug("ping failed", err);
      });
    }, intervalMs);

    return () => clearInterval(pingPongTimer);
  }
}

module.exports = Signaler;
