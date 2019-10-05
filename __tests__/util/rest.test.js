const Rest = require("../../src/util/rest");
const fetchMock = require("fetch-mock");

afterEach(fetchMock.reset);

describe("getJSON()", () => {
  test("should GET specified path", async () => {
    fetchMock.getOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", {});
    await r.getJSON("/foo");

    const [url, options] = fetchMock.lastCall();
    expect(url).toBe("http://example.com/foo");
    expect(options.method).toBe("get");
  });

  test("should extend headers", async () => {
    fetchMock.getOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", { "X-Hello": "world" });
    await r.getJSON("/foo");

    const [url, options] = fetchMock.lastCall();
    expect(url).toBe("http://example.com/foo");
    expect(options.headers["X-Hello"]).toBe("world");
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  test("should return JSON object w/ status", async () => {
    fetchMock.getOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", {});
    const res = await r.getJSON("/foo");

    expect(() => JSON.stringify(res)).not.toThrowError();
    expect(res.status).toBe(200);
  });

  test("should throw on network issue", async done => {
    fetchMock.getOnce("*", { throws: new Error("Failed to fetch") });

    const r = new Rest("http://example.com", {});
    await r
      .getJSON("/foo")
      .then(() => done.fail("should throw!"))
      .catch(() => done());
  });
});

describe("postJSON()", () => {
  test("should POST specified path", async () => {
    fetchMock.postOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", {});
    await r.postJSON("/bar/baz", { hi: "test" });

    const [url, options] = fetchMock.lastCall();
    expect(url).toBe("http://example.com/bar/baz");
    expect(options.method).toBe("post");
  });

  test("should extend headers", async () => {
    fetchMock.postOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", { "X-Hello": "world" });
    await r.postJSON("/bar/baz", { hi: "test" });

    const [url, options] = fetchMock.lastCall();
    expect(url).toBe("http://example.com/bar/baz");
    expect(options.headers["X-Hello"]).toBe("world");
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  test("should request body", async () => {
    fetchMock.postOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", { "X-Hello": "world" });
    await r.postJSON("/bar/baz", { hi: "test" });

    const [, options] = fetchMock.lastCall();
    expect(JSON.parse(options.body)).toEqual({ hi: "test" });
  });

  test("should return JSON object w/ status", async () => {
    fetchMock.postOnce("*", { ok: 1 });

    const r = new Rest("http://example.com", {});
    const res = await r.postJSON("/bar/baz", { hi: "test" });

    expect(() => JSON.stringify(res)).not.toThrowError();
    expect(res.status).toBe(200);
  });

  test("should throw on network issue", async done => {
    fetchMock.postOnce("*", { throws: new Error("Failed to fetch") });

    const r = new Rest("http://example.com", {});
    await r
      .postJSON("/bar/baz")
      .then(() => done.fail("should throw!"))
      .catch(() => done());
  });
});
