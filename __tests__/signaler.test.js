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

  test("should set url", () => {
    const signaler = new Signaler();

    signaler.setUrl("http://localhost:1234");
    expect(signaler.attrsForTest.url).toBe("http://localhost:1234");
    signaler.setUrl("http://localhost:4567");
    expect(signaler.attrsForTest.url).toBe("http://localhost:4567");
  });
});

describe("addHeader()", () => {
  test("should return this", () => {
    const signaler = new Signaler();

    expect(signaler.addHeader("key", "value")).toBe(signaler);
  });

  test("should add header", () => {
    const signaler = new Signaler();

    signaler.addHeader("foo", "bar");
    expect(signaler.attrsForTest.headers).toHaveProperty("foo", "bar");
    signaler.addHeader("foo2", "bar2").addHeader("foo3", "bar3");
    expect(signaler.attrsForTest.headers).toHaveProperty("foo", "bar");
    expect(signaler.attrsForTest.headers).toHaveProperty("foo2", "bar2");
    expect(signaler.attrsForTest.headers).toHaveProperty("foo3", "bar3");
  });
});

describe("initialize()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.initialize({ auth: null });

    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/initialize",
      {},
      { auth: null }
    );
    expect(res).toEqual({ ok: 1 });
  });
});

describe("connect()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.connect({ id: 1 });

    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/transport/connect",
      {},
      { id: 1 }
    );
    expect(res).toEqual({ ok: 1 });
  });
});

describe("produce()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.produce({ id: 2 });

    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/transport/produce",
      {},
      { id: 2 }
    );
    expect(res).toEqual({ ok: 1 });
  });
});

describe("start()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.start({ id: 3 });

    expect(mock$fetchJSON).toHaveBeenCalledWith(
      "POST",
      "/record/start",
      {},
      { id: 3 }
    );
    expect(res).toEqual({ ok: 1 });
  });

  test("should call fetchJSON() with interval", async () => {
    const clock = lolex.install();

    const signaler = new Signaler();
    await signaler.start({ id: 3 }, 3000);

    expect(mock$fetchJSON).not.toHaveBeenCalledWith("GET", "/record/ping", {});
    clock.tick(10000);
    expect(mock$fetchJSON).toHaveBeenCalledWith("GET", "/record/ping", {});
    // start: 1, ping: 3
    expect(mock$fetchJSON).toHaveBeenCalledTimes(1 + 3);

    clock.uninstall();
  });
});

describe("stop()", () => {
  test("should call fetchJSON()", async () => {
    const signaler = new Signaler();
    const res = await signaler.stop();

    expect(mock$fetchJSON).toHaveBeenCalledWith("POST", "/record/stop", {}, {});
    expect(res).toEqual({ ok: 1 });
  });

  test("should call fetchJSON() with interval", async () => {
    const clock = lolex.install();

    const signaler = new Signaler();
    await signaler.start({ id: 3 }, 3000);
    await signaler.stop();

    clock.tick(10000);
    expect(mock$fetchJSON).not.toHaveBeenCalledWith("GET", "/record/ping", {});
    // start: 1, ping: 0, stop: 1
    expect(mock$fetchJSON).toHaveBeenCalledTimes(1 + 1);

    clock.uninstall();
  });
});
