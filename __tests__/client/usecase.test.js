const { EventEmitter } = require("events");
const {
  initializeSession,
  createTransportAndBindEvents,
  createProducerAndBindEvents,
  startRecording,
  stopRecording
} = require("../../src/client/usecase");
const Signaler = require("../../src/signaler");
const { initialize_200 } = require("./fixture");

describe("initializeSession()", () => {
  let signaler;
  let mock$request;
  let mock$setUrl;
  let mock$addHeader;
  beforeEach(() => {
    signaler = new Signaler();
    mock$request = jest
      .spyOn(signaler, "request")
      .mockResolvedValue(initialize_200);
    mock$setUrl = jest.spyOn(signaler, "setUrl");
    mock$addHeader = jest.spyOn(signaler, "addHeader");
  });
  afterEach(() => {
    mock$request.mockRestore();
    mock$setUrl.mockRestore();
    mock$addHeader.mockRestore();
  });

  test("should call signaler.request()", async () => {
    await initializeSession({
      signaler,
      authParams: { p: 1 },
      iceSercers: null,
      iceTransportPolicy: "all"
    });

    expect(mock$request).toHaveBeenCalledTimes(1);
    expect(mock$request).toHaveBeenCalledWith("POST", "/initialize", {
      p: 1
    });
  });

  test("should update signaler", async () => {
    mock$request.mockResolvedValueOnce(initialize_200);

    await initializeSession({
      signaler,
      authParams: null,
      iceSercers: null,
      iceTransportPolicy: "all"
    });

    expect(mock$setUrl).toHaveBeenCalledWith(initialize_200.fqdn);
    expect(mock$addHeader).toHaveBeenCalledWith(
      "X-Session-Token",
      initialize_200.sessionToken
    );
  });

  test("should apply iceServers", async () => {
    mock$request.mockResolvedValue(initialize_200);

    const res1 = await initializeSession({
      signaler,
      authParams: null,
      iceServers: null,
      iceTransportPolicy: "all"
    });
    expect(res1.transportInfo.iceServers).not.toHaveLength(0);

    const res2 = await initializeSession({
      signaler,
      authParams: null,
      iceServers: [],
      iceTransportPolicy: "all"
    });
    expect(res2.transportInfo.iceServers).toHaveLength(0);
  });

  test("should apply iceTransportPolicy", async () => {
    mock$request.mockResolvedValue(initialize_200);

    const res1 = await initializeSession({
      signaler,
      authParams: null,
      iceServers: null,
      iceTransportPolicy: "all"
    });
    expect(res1.transportInfo.iceTransportPolicy).toBe("all");

    const res2 = await initializeSession({
      signaler,
      authParams: null,
      iceServers: null,
      iceTransportPolicy: "relay"
    });
    expect(res2.transportInfo.iceTransportPolicy).toBe("relay");
  });
});

describe("createTransportAndBindEvents()", () => {
  let fake$device;
  beforeEach(() => {
    fake$device = {
      createSendTransport: jest
        .fn()
        .mockImplementation(() => new EventEmitter())
    };
  });
  afterEach(() => {
    fake$device.createSendTransport.mockRestore();
  });

  test("should call device.createSendTransport()", () => {
    createTransportAndBindEvents({
      device: fake$device,
      transportInfo: { id: 1 }
    });
    expect(fake$device.createSendTransport).toHaveBeenCalledWith({ id: 1 });
  });

  test("should call signaler.request() at once(connect)", done => {
    const signaler = new Signaler();
    const mock$request = jest.spyOn(signaler, "request").mockResolvedValue({});

    const transport = createTransportAndBindEvents({
      device: fake$device,
      signaler,
      transportInfo: {}
    });

    transport.emit(
      "connect",
      { id: "xxx" },
      () => {
        expect(mock$request).toHaveBeenCalledWith(
          "POST",
          "/transport/connect",
          { id: "xxx" }
        );
        done();
      },
      done.fail
    );
  });

  test("should call signaler.request() at once(produce)", done => {
    const signaler = new Signaler();
    const mock$request = jest
      .spyOn(signaler, "request")
      .mockResolvedValue({ id: "xxx" });

    const transport = createTransportAndBindEvents({
      device: fake$device,
      signaler,
      transportInfo: {}
    });

    transport.emit(
      "produce",
      { kind: "audio" },
      res => {
        expect(res).toEqual({ id: "xxx" });
        expect(mock$request).toHaveBeenCalledWith(
          "POST",
          "/transport/produce",
          { kind: "audio" }
        );
        done();
      },
      done.fail
    );
  });

  test("should call onAbort() at on(connectionstatechange === disconnected)", done => {
    const transport = createTransportAndBindEvents({
      device: fake$device,
      onAbort: () => done()
    });

    transport.emit("connectionstatechange", "connecting");
    expect("here should be passed").toBeTruthy();
    transport.emit("connectionstatechange", "connected");
    expect("also here should be passed").toBeTruthy();

    transport.emit("connectionstatechange", "disconnected");
  });
});

describe("createProducerAndBindEvents()", () => {
  let fake$transport;
  beforeEach(() => {
    fake$transport = {
      produce: jest.fn().mockImplementation(async () => new EventEmitter())
    };
  });
  afterEach(() => {
    fake$transport.produce.mockRestore();
  });

  test("should call transport.produce()", async () => {
    await createProducerAndBindEvents({
      transport: fake$transport,
      track: { kind: "audio" }
    });
    expect(fake$transport.produce).toHaveBeenCalledWith({
      track: { kind: "audio" }
    });
  });

  test("should call onAbort() at on(transportclose)", async done => {
    const producer = await createProducerAndBindEvents({
      transport: fake$transport,
      onAbort: () => done()
    });

    producer.emit("transportclose");
  });

  test("should call onAbort() at on(trackended)", async done => {
    const producer = await createProducerAndBindEvents({
      transport: fake$transport,
      onAbort: () => done()
    });

    producer.emit("trackended");
  });
});

describe("startRecording()", () => {
  let signaler;
  let mock$request;
  let mock$startPing;
  beforeEach(() => {
    signaler = new Signaler();
    mock$request = jest
      .spyOn(signaler, "request")
      .mockResolvedValue({ id: "xxx" });
    mock$startPing = jest
      .spyOn(signaler, "startPing")
      .mockReturnValue(() => {});
  });
  afterEach(() => {
    mock$request.mockRestore();
    mock$startPing.mockRestore();
  });

  test("should call signaler.request() and return id", async () => {
    const { id } = await startRecording({ signaler, producerId: "p1" });
    expect(id).toBe("xxx");
    expect(mock$request).toHaveBeenCalledWith("POST", "/record/start", {
      producerId: "p1"
    });
  });

  test("should call signaler.startPing() and return disposer", async () => {
    const { stopPingTimer } = await startRecording({ signaler });
    expect(typeof stopPingTimer).toBe("function");
    expect(mock$startPing).toHaveBeenCalled();
  });
});

describe("stopRecording()", () => {
  let signaler;
  let mock$request;
  let mock$startPing;
  beforeEach(() => {
    signaler = new Signaler();
    mock$request = jest
      .spyOn(signaler, "request")
      .mockResolvedValue({ id: "xxx" });
    mock$startPing = jest
      .spyOn(signaler, "startPing")
      .mockReturnValue(() => {});
  });
  afterEach(() => {
    mock$request.mockRestore();
    mock$startPing.mockRestore();
  });

  test("should call signaler.request()", async () => {
    await stopRecording({ signaler, stopPingTimer: () => {} });
    expect(mock$request).toHaveBeenCalledWith("POST", "/record/stop", {});
  });

  test("should call stopPingTimer()", async () => {
    const mock$stopPingTimer = jest.fn();
    await stopRecording({ signaler, stopPingTimer: mock$stopPingTimer });
    expect(mock$stopPingTimer).toHaveBeenCalled();
  });
});
