const lolex = require("lolex");
const Signaler = require("../src/signaler");

jest.mock("../src/util/fetch-json");
const mock$fetchJSON = require("../src/util/fetch-json");

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
    await signaler.fetchJSON("GET", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "GET",
      "http://localhost:1234/foo",
      {},
      {}
    );

    signaler.setUrl("http://localhost:4567");
    await signaler.fetchJSON("GET", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "GET",
      "http://localhost:4567/foo",
      {},
      {}
    );
  });
});

describe("addHeader()", () => {
  test("should return this", () => {
    const signaler = new Signaler();

    expect(signaler.addHeader("key", "value")).toBe(signaler);
  });

  test("should add header", async () => {
    const signaler = new Signaler();

    signaler.addHeader("foo", "bar");
    await signaler.fetchJSON("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar" },
      {}
    );

    signaler.addHeader("foo2", "bar2").addHeader("foo3", "bar3");
    await signaler.fetchJSON("POST", "/foo", {});
    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/foo",
      { foo: "bar", foo2: "bar2", foo3: "bar3" },
      {}
    );
  });
});

describe("fetchJSON()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.fetchJSON("POST", "/foo", { hi: 1 });

    expect(mock$fetchJSON).toHaveBeenCalledWith("POST", "/foo", {}, { hi: 1 });
    expect(res).toEqual({ ok: 1 });
  });

  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.fetchJSON("GET", "/bar", { hi: 1 });

    expect(mock$fetchJSON).toHaveBeenCalledWith("GET", "/bar", {}, { hi: 1 });
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
