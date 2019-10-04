import Client from "../src/client";

describe("exntends EventEmitter", () => {
  it("should inherit EventEmitter", done => {
    const client = new Client({});
    client.once("foo", done);
    client.emit("foo");
  });
});

describe("start()", () => {
  it("should throw if track is missing", async done => {
    const client = new Client({});
    await client
      .start()
      .then(() => done.fail("should throw!"))
      .catch(err => {
        console.log(err);
        // TODO: expect(err).toBeInstanceOf(TodoError);
        done();
      });
  });

  it("TODO: should throw if track.kind is not audio");
  it("TODO: should throw if already started");
  it("TODO: should throw if device can not produce audio");

  it("TODO: should call signaling start");

  it("TODO: should return id for recording");
});

describe("stop()", () => {
  it("should throw if not started", async done => {
    const client = new Client({});
    await client
      .stop()
      .then(() => done.fail("should throw!"))
      .catch(err => {
        console.log(err);
        // TODO: expect(err).toBeInstanceOf(TodoError);
        done();
      });
  });

  it("TODO: should call signaling stop");

  it(
    "TODO: should be called and emit(abort) when connectionstate disconnected"
  );
  it("TODO: should be called and emit(abort) when transportclose");
  it("TODO: should be called and emit(abort) when trackended");
});
