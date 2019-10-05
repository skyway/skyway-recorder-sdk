const { createRecorder } = require("../src");
const Client = require("../src/client");
const { recordingServerHost } = require("../src/util/constants");
const { initializeResponse } = require("./fixture");
const fetchMock = require("fetch-mock");

describe("createRecorder()", () => {
  afterEach(fetchMock.reset);

  test("should return recorder client", async () => {
    fetchMock.postOnce(`${recordingServerHost}/initialize`, initializeResponse);

    const client = await createRecorder();
    expect(client).toBeInstanceOf(Client);
  });

  test.todo("TODO: should throw when invalid apikey passed");
  test.todo("TODO: should throw when invalid credential passed");

  test("should throw when signaling returns invalid response", async done => {
    fetchMock.postOnce(`${recordingServerHost}/initialize`, {});

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
