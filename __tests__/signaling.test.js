import Signaling from "../src/signaling";
import Rest from "../src/util/rest";

describe("initialize()", () => {
  it("should call rest", async () => {
    const rest = new Rest();
    const spy = spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: { ok: 1 }
    });

    const signaling = new Signaling(rest);
    const res = await signaling.initialize({ a: 1 });

    expect(spy).toHaveBeenCalledWith("/initialize", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("connect()", () => {
  it("should call rest", async () => {
    const rest = new Rest();
    const spy = spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: { ok: 1 }
    });

    const signaling = new Signaling(rest);
    const res = await signaling.connect({ a: 1 });

    expect(spy).toHaveBeenCalledWith("/transport/connect", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("produce()", () => {
  it("should call rest", async () => {
    const rest = new Rest();
    const spy = spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: { ok: 1 }
    });

    const signaling = new Signaling(rest);
    const res = await signaling.produce({ a: 1 });

    expect(spy).toHaveBeenCalledWith("/transport/produce", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});

describe("start()", () => {
  it("should call rest", async () => {
    const rest = new Rest();
    const postSpy = spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: { ok: 1 }
    });

    const signaling = new Signaling(rest);
    const res = await signaling.start({ a: 1 }, 3000);

    expect(postSpy).toHaveBeenCalledWith("/record/start", { a: 1 });
    expect(res).toEqual({ ok: 1 });
  });

  it("should call rest with interval", async () => {
    const clock = jasmine.clock().install();
    const rest = new Rest();
    const getSpy = spyOn(rest, "getJSON").and.resolveTo({
      status: 200,
      data: {}
    });
    spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: {}
    });

    const signaling = new Signaling(rest);
    await signaling.start({ a: 1 }, 3000);

    expect(getSpy).not.toHaveBeenCalled();

    clock.tick(10000);
    expect(getSpy).toHaveBeenCalledWith("/record/ping");
    expect(getSpy).toHaveBeenCalledTimes(3);

    clock.uninstall();
  });
});

describe("stop()", () => {
  it("should call rest", async () => {
    const rest = new Rest();
    spyOn(rest, "getJSON").and.resolveTo({
      status: 200,
      data: {}
    });
    const postSpy = spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: { ok: 1 }
    });

    const signaling = new Signaling(rest);
    const res = await signaling.stop();
    expect(postSpy).toHaveBeenCalledWith("/record/stop", {});
    expect(res).toEqual({ ok: 1 });
  });

  it("should stop interval", async () => {
    const clock = jasmine.clock().install();
    const rest = new Rest();
    const getSpy = spyOn(rest, "getJSON").and.resolveTo({
      status: 200,
      data: {}
    });
    spyOn(rest, "postJSON").and.resolveTo({
      status: 200,
      data: {}
    });

    const signaling = new Signaling(rest);
    await signaling.start({ a: 1 }, 3000);
    await signaling.stop();

    clock.tick(10000);
    expect(getSpy).not.toHaveBeenCalled();

    clock.uninstall();
  });
});
