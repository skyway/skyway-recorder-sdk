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

  addHeader(key, value) {
    debug(`addHeader(${key}, ${value})`);
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

    if (status === 500) {
      throw new ServerError(`${data.error}: ${data.message}`);
    }
    if (status !== 200) {
      throw new RequestError(`${data.error}: ${data.message}`);
    }

    return data;
  }

  startPing(method, path, intervalMs) {
    const pingPongTimer = setInterval(() => {
      debug("ping", method, path);
      fetchJSON(method, this._url + path, this._headers).catch(() => {
        // nothing to do when ping fails, no retry, no alerts
        // TODO: really?
        // when server restarts, sdk keeps sending ping and get 401 forever..
        // it should stop ping and call onAbort()
      });
    }, intervalMs);

    return () => clearInterval(pingPongTimer);
  }
}

module.exports = Signaler;
