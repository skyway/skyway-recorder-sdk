import { postJSON } from "./utils";

export default class Signaling {
  constructor(baseUrl, headers = {}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async initialize(apiKey, credential) {
    const url = this._baseUrl + "/initialize";
    const headers = this._headers;
    const body = {
      apiKey,
      credential
    };

    const res = await postJSON(url, headers, body);
    return res;
  }

  async connect() {}
  async start() {}
}
