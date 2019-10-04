export default class Rest {
  constructor(url, headers) {
    this._url = url;
    this._headers = headers;
  }

  async getJSON(path) {
    const res = await fetch(this._url + path, {
      method: "get",
      headers: Object.assign(
        {
          "Content-Type": "application/json"
        },
        this._headers
      )
    });

    const data = await res.json();
    const status = res.status;
    return { status, data };
  }

  async postJSON(path, body) {
    const res = await fetch(this._url + path, {
      method: "post",
      headers: Object.assign(
        {
          "Content-Type": "application/json"
        },
        this._headers
      ),
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const status = res.status;
    return { status, data };
  }
}
