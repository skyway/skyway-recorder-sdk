const Client = require("../src/client");

describe("exntends EventEmitter", () => {
  test("should inherit EventEmitter", done => {
    const client = new Client({});
    client.once("foo", done);
    client.emit("foo");
  });
});

describe("start()", () => {
  test("should throw if track is missing", async done => {
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

  test.todo("TODO: should throw if track.kind is not audio");
  test.todo("TODO: should throw if already started");
  test.todo("TODO: should throw if device can not produce audio");

  test.todo("TODO: should call signaling start");

  test.todo("TODO: should return id for recording");
});

describe("stop()", () => {
  test("should throw if not started", async done => {
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

  test.todo("TODO: should call signaling stop");

  test.todo(
    "TODO: should be called and emtest(abort) when connectionstate disconnected"
  );
  test.todo("TODO: should be called and emtest(abort) when transportclose");
  test.todo("TODO: should be called and emtest(abort) when trackended");
});
