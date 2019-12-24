const lolex = require("lolex");
const Signaler = require("../../src/signaler");

jest.mock("../../src/signaler/fetch-json");
const mock$fetchJSON = require("../../src/signaler/fetch-json");

beforeEach(() => {
  mock$fetchJSON.mockResolvedValue({ status: 200, data: { ok: 1 } });
});
afterEach(() => {
  mock$fetchJSON.mockRestore();
});

describe("setUrl()", () => {
  test("should return this", () => {
    const signaler = new Signaler();

    expect(signaler.setUrl()).toBe(signaler);
  });

  test("should set url", async () => {
    const signaler = new Signaler();

    signaler.setUrl("http://localhost:1234");
    await signaler.request("GET", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "GET",
      "http://localhost:1234/foo",
      {},
      {}
    );

    signaler.setUrl("http://localhost:4567");
    await signaler.request("GET", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "GET",
      "http://localhost:4567/foo",
      {},
      {}
    );
  });
});

describe("setHeader()", () => {
  test("should return this", () => {
    const signaler = new Signaler();

    expect(signaler.setHeader("key", "value")).toBe(signaler);
  });

  test("should set header", async () => {
    const signaler = new Signaler();

    signaler.setHeader("foo", "bar");
    await signaler.request("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar" },
      {}
    );

    signaler.setHeader("foo2", "bar2").setHeader("foo3", "bar3");
    await signaler.request("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar", foo2: "bar2", foo3: "bar3" },
      {}
    );
  });

  test("should set existing header", async () => {
    const signaler = new Signaler();

    signaler.setHeader("foo", "bar");
    await signaler.request("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar" },
      {}
    );

    signaler.setHeader("foo", "bar2");
    await signaler.request("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar2" },
      {}
    );
  });
});

describe("request()", () => {
  test("should call POST fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.request("POST", "/foo", { hi: 1 });

    expect(mock$fetchJSON).toHaveBeenCalledWith("POST", "/foo", {}, { hi: 1 });
    expect(res).toEqual({ ok: 1 });
  });

  test("should call GET fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.request("GET", "/bar", {});

    expect(mock$fetchJSON).toHaveBeenCalledWith("GET", "/bar", {}, {});
    expect(res).toEqual({ ok: 1 });
  });
});

describe("startPing()", () => {
  test("should call fetchJSON() w/ interval", async () => {
    const clock = lolex.install();

    const signaler = new Signaler();
    signaler.startPing("GET", "/ping", 3000);

    clock.tick(10000);
    expect(mock$fetchJSON).toHaveBeenCalledWith("GET", "/ping", {});
    expect(mock$fetchJSON).toHaveBeenCalledTimes(3);

    clock.uninstall();
  });

  test("should call fetchJSON() w/ interval", async () => {
    const clock = lolex.install();

    const signaler = new Signaler();
    const stop = signaler.startPing("GET", "/ping", 3000);

    clock.tick(10000);
    expect(mock$fetchJSON).toHaveBeenCalledWith("GET", "/ping", {});
    expect(mock$fetchJSON).toHaveBeenCalledTimes(3);

    stop();
    clock.tick(10000);
    expect(mock$fetchJSON).toHaveBeenCalledTimes(3);

    clock.uninstall();
  });
});
