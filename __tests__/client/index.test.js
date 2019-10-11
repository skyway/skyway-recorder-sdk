const Client = require("../../src/client");
const {
  initializeSession,
  // createDevice,
  // createTransportAndBindEvents,
  createProducerAndBindEvents,
  startRecording,
  closeTransport,
  stopRecording
} = require("../../src/client/usecase");
const { initialize_200 } = require("./fixture");

jest.mock("../../src/client/usecase");

describe("constructor()", () => {
  test("should inherits EventEmitter", done => {
    const client = new Client({}, {});
    client.on("ev", done);
    client.emit("ev");
  });

  test("should get state", () => {
    const client = new Client({}, {});
    expect(client.state).toBe("new");
  });
});

describe("start()", () => {
  beforeEach(() => {
    initializeSession.mockResolvedValue(initialize_200);
    createProducerAndBindEvents.mockResolvedValue({ id: "p1" });
    startRecording.mockResolvedValue({ id: "r1" });
  });
  afterEach(() => {
    initializeSession.mockRestore();
    createProducerAndBindEvents.mockRestore();
    startRecording.mockRestore();
  });

  test("should throw if track is missing", async done => {
    await new Client({}, {})
      .start()
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("missing");
        done();
      });
  });

  test("should throw if video track passed", async done => {
    await new Client({}, {})
      .start({ kind: "video" })
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("video");
        done();
      });
  });

  test("should throw if call start() repeatdlly", async done => {
    const client = new Client({}, {});
    await client.start({ kind: "audio" });
    await client
      .start({ kind: "audio" })
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("started");
        done();
      });
  });

  test.todo("TODO: should throw if some of usecases throw");

  test("should return object w/ id", async () => {
    const client = new Client({}, {});
    const res = await client.start({ kind: "audio" });
    expect(res).toEqual({ id: "r1" });
  });
});

describe("stop()", () => {
  beforeEach(() => {
    initializeSession.mockResolvedValue(initialize_200);
    createProducerAndBindEvents.mockResolvedValue({ id: "p1" });
    startRecording.mockResolvedValue({ id: "r1" });
  });
  afterEach(() => {
    initializeSession.mockRestore();
    createProducerAndBindEvents.mockRestore();
    startRecording.mockRestore();
    closeTransport.mockRestore();
    stopRecording.mockRestore();
  });

  test("should throw if not started", async done => {
    await new Client({}, {})
      .stop()
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("started");
        done();
      });
  });

  test("should throw if already closed", async done => {
    const client = new Client({}, {});
    await client.start({ kind: "audio" });
    await client.stop();

    await client
      .stop()
      .then(() => done.fail("should reject"))
      .catch(err => {
        expect(err.message).toMatch("closed");
        done();
      });
  });

  test("should call closeTransport()", async () => {
    const client = new Client({}, {});
    await client.start({ kind: "audio" });
    await client.stop();

    expect(closeTransport).toHaveBeenCalled();
  });

  test("should call stopRecording()", async () => {
    const client = new Client({}, {});
    await client.start({ kind: "audio" });
    await client.stop();

    expect(stopRecording).toHaveBeenCalled();
  });

  test.todo("TODO: should throw if some of usecases throw");
});
