const { createRecorder } = require("../src");
const Client = require("../src/client");
const { initializeResponse } = require("./fixture");

// name should start with `mock`
const mock$initialize = jest.fn();
jest.mock("../src/signaling", () => {
  // this means class
  return function() {
    return { initialize: mock$initialize };
  };
});

beforeEach(() => {
  mock$initialize.mockResolvedValue(initializeResponse);
});
afterEach(() => {
  mock$initialize.mockRestore();
});

describe("createRecorder(apiKey)", () => {
  test("should return recorder client", async () => {
    const client = await createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da");
    expect(client).toBeInstanceOf(Client);
  });

  test("should return recorder client w/ auth", async () => {
    const client = await createRecorder(
      "fa974205-cfdc-4a68-aac0-18b6b374b4da",
      {
        auth: { timestamp: Date.now(), credential: "myhash" }
      }
    );
    expect(client).toBeInstanceOf(Client);
  });

  test("should throw when invalid apikey passed", async done => {
    const cases = [
      null,
      undefined,
      1,
      {},
      true,
      "",
      "hoge",
      "fa974205-cfdc-4a68-18b6b374b4da"
    ];

    for (const apiKey of cases) {
      await createRecorder(apiKey)
        .then(() => done.fail("should throw!"))
        .catch(err => {
          // TODO: expect(err).toBeInstanceOf(TodoError);
          err;
        });
    }
    done();
  });

  test("should throw when signaling returns invalid response", async done => {
    mock$initialize.mockResolvedValueOnce({ error: 1 });

    await createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da")
      .then(() => done.fail("should throw!"))
      .catch(err => {
        // TODO: expect(err).toBeInstanceOf(TodoError);
        err;
        done();
      });
  });

  test("should throw when signaling failed by network issue", async done => {
    mock$initialize.mockRejectedValueOnce({});

    await createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da")
      .then(() => done.fail("should throw!"))
      .catch(err => {
        // TODO: expect(err).toBeInstanceOf(TodoError);
        err;
        done();
      });
  });
});

describe("createRecorder(apiKey, options)", () => {
  test("should throw when invalid auth params passed", async done => {
    const cases = [
      1,
      true,
      "hoge",
      {},
      { timestamp: 123 },
      { timestamp: Date.now() },
      { timestamp: 123, credential: "valid" },
      { timestamp: Date.now(), credential: "" }
    ];

    for (const auth of cases) {
      await createRecorder("fa974205-cfdc-4a68-aac0-18b6b374b4da", { auth })
        .then(() => done.fail("should throw!"))
        .catch(err => {
          // TODO: expect(err).toBeInstanceOf(TodoError);
          err;
        });
    }
    done();
  });
});
