export default class Rest {
  constructor(url, headers) {
    this._url = url;
    this._headers = headers;
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

    const json = await res.json();
    return json;
  }
}
