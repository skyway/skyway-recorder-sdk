const { createRecorder } = require("../src");
const Client = require("../src/client");

describe("createRecorder(apiKey)", () => {
  test("should return client instance", () => {
    const client = createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da");
    expect(client).toBeInstanceOf(Client);
  });

  test("should throw if apiKey is not passed", () => {
    expect(() => createRecorder()).toThrow("missing");
  });

  test("should throw if apiKey is invalid format", () => {
    const cases = [
      "",
      "fa974205-cfdc-4a68-aac0",
      "fa974205-4a68-aac0-18b6b374b4da"
    ];

    for (const apiKey of cases) {
      expect(() => createRecorder(apiKey)).toThrow("format");
    }
  });
});

describe("createRecorder(apiKey, options)", () => {
  test("should return client instance", () => {
    const cases = [
      { auth: { timestamp: 1234567890, credential: "password" } },
      { auth: { timestamp: "1234567890", credential: "password" } },
      { iceServers: [] },
      { iceServers: [{ urls: "stun:example.com" }] },
      { iceTransportPolicy: "relay" }
    ];

    for (const options of cases) {
      const client = createRecorder(
        "fa974205-cfdc-4a68-aac0-18b6b374b4da",
        options
      );
      expect(client).toBeInstanceOf(Client);
    }
  });

  test("should throw if options.auth is invalid format", () => {
    const cases = [
      [{}, "timestamp must"],
      [{ credential: "password" }, "timestamp must"],
      [{ timestamp: 12345, credential: false }, "timestamp must"],
      [{ timestamp: 1234567890, credential: false }, "credential must"],
      [{ timestamp: 1234567890, credential: "" }, "credential must"]
    ];

    for (const [auth, message] of cases) {
      expect(() =>
        createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da", { auth })
      ).toThrow(message);
    }
  });

  test("should throw if options.iceServers is invalid format", () => {
    const cases = [{ urls: "stun:example.com" }, new Set()];

    for (const iceServers of cases) {
      expect(() =>
        createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da", { iceServers })
      ).toThrow("iceServers must");
    }
  });

  test("should throw if options.iceTransportPolicy is invalid format", () => {
    const cases = ["foo", true, {}];

    for (const iceTransportPolicy of cases) {
      expect(() =>
        createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da", {
          iceTransportPolicy
        })
      ).toThrow("iceTransportPolicy must");
    }
  });
});
