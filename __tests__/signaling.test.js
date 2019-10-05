const lolex = require("lolex");
const Signaling = require("../src/signaling");
const Rest = require("../src/util/rest");

jest.mock("../src/util/rest");

let rest;
let signaling;
beforeEach(() => {
  rest = new Rest();
  signaling = new Signaling(rest);
  rest.getJSON.mockResolvedValue({ status: 200, data: {} });
  rest.postJSON.mockResolvedValue({ status: 200, data: { ok: 1 } });
});
afterEach(() => {
  rest.getJSON.mockRestore();
  rest.postJSON.mockRestore();
});

describe("initialize()", () => {
  test("should call rest", async () => {
    const res = await signaling.initialize({ a: 1 });

    expect(rest.postJSON).toHaveBeenCalledWith("/initialize", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("connect()", () => {
  test("should call rest", async () => {
    const res = await signaling.connect({ a: 1 });

    expect(rest.postJSON).toHaveBeenCalledWith("/transport/connect", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("produce()", () => {
  test("should call rest", async () => {
    const res = await signaling.produce({ a: 1 });

    expect(rest.postJSON).toHaveBeenCalledWith("/transport/produce", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("start()", () => {
  test("should call rest", async () => {
    const res = await signaling.start({ a: 1 }, 3000);

    expect(rest.postJSON).toHaveBeenCalledWith("/record/start", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });

  test("should call rest with interval", async () => {
    const clock = lolex.install();

    await signaling.start({ a: 1 }, 3000);

    expect(rest.getJSON).not.toHaveBeenCalled();
    clock.tick(10000);
    expect(rest.getJSON).toHaveBeenCalledWith("/record/ping");
    expect(rest.getJSON).toHaveBeenCalledTimes(3);

    clock.uninstall();
  });
});

describe("stop()", () => {
  test("should call rest", async () => {
    const res = await signaling.stop();

    expect(rest.postJSON).toHaveBeenCalledWith("/record/stop", {});
    expect(res).toEqual({ ok: 1 });
  });

  test("should stop interval", async () => {
    const clock = lolex.install();

    await signaling.start({ a: 1 }, 3000);
    await signaling.stop();

    clock.tick(10000);
    expect(rest.getJSON).not.toHaveBeenCalled();

    clock.uninstall();
  });
});
