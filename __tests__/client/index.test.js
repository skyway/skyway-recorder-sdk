const Client = require("../src/client");
const Signaler = require("../src/signaler");
const { initialize_200, start_200 } = require("./fixture");

jest.mock("../src/util/factory");
const { createTransport, createProducer } = require("../src/util/factory");

describe("constructor()", () => {
  test("should inherit EventEmitter", done => {
    const client = new Client(new Signaler(), {});

    client.once("dummy", value => {
      expect(value).toBe("ok");
      done();
    });
    client.emit("dummy", "ok");
  });
});

describe("start()", () => {
  let signaler;
  let mock$fetchJSON;
  beforeEach(() => {
    signaler = new Signaler();
    mock$fetchJSON = jest
      .spyOn(signaler, "fetchJSON")
      .mockResolvedValueOnce(initialize_200)
      .mockResolvedValueOnce(start_200);

    createTransport.mockReturnValueOnce({
      on: jest.fn(),
      once: jest.fn()
    });
    createProducer.mockResolvedValueOnce({
      once: jest.fn()
    });
  });
  afterEach(() => {
    mock$fetchJSON.mockRestore();
    createTransport.mockRestore();
    createProducer.mockRestore();
  });

  test("should return id for recording", async () => {
    const client = new Client(signaler, {});

    const res = await client.start({ kind: "audio" });
    expect(res).toEqual(start_200.id);
  });

  test("should throw if track is not passed", async done => {
    const client = new Client(signaler, {});

    await client
      .start()
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("missing");
        done();
      });
  });

  test("should throw if track.kind is not audio", async done => {
    const client = new Client(signaler, {});

    await client
      .start({ kind: "video" })
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("video track");
        done();
      });
  });

  test("should throw if already started", async done => {
    const client = new Client(signaler, {});
    await client.start({ kind: "audio" });

    await client
      .start({ kind: "audio" })
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("started");
        done();
      });
  });

  test.todo("TODO: should call signaler.initialize()");
  test.todo("TODO: should call signaler.initialize() w/ auth");
  test.todo("TODO: should update signaler settings after initialize");

  test.todo("TODO: should call createTransport() w/ ICE configuration");

  test.todo("TODO: should call signaler.start()");
});

describe("stop()", () => {
  test("should throw if not started", async done => {
    const client = new Client(new Signaler(), {});
    await client
      .stop()
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("started");
        done();
      });
  });

  test.todo("TODO: should call signaler.stop()");
  test.todo("TODO: should close transport and producer");
});

describe("emit(abort)", () => {
  test.todo(
    "TODO: should call stop() and emit(abort) when connectionstate disconnected"
  );
  test.todo("TODO: should call stop() and emit(abort) when transportclose");
  test.todo("TODO: should call stop() and emit(abort) when trackended");
});
