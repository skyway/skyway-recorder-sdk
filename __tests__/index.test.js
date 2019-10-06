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

afterEach(() => {
  mock$initialize.mockRestore();
});

describe("createRecorder()", () => {
  test("should return recorder client", async () => {
    mock$initialize.mockResolvedValueOnce(initializeResponse);

    const client = await createRecorder();
    expect(client).toBeInstanceOf(Client);
  });

  test.todo("TODO: should throw when invalid apikey passed");
  test.todo("TODO: should throw when invalid credential passed");

  test("should throw when signaling returns invalid response", async done => {
    mock$initialize.mockResolvedValueOnce({ error: 1 });

    await createRecorder()
      .then(() => done.fail("should throw!"))
      .catch(err => {
        console.log(err);
        // TODO: expect(err).toBeInstanceOf(TodoError);
        done();
      });
  });

  test.todo("TODO: should throw when signaling failed by network issue");
});
