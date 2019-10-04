import { version, createRecorder } from "../src/index";
import Client from "../src/client";
import { recordingServerHost } from "../src/constants";
import { initializeResponse } from "./fixture";
const { fetchMock } = window;

afterEach(fetchMock.reset);

describe("version", () => {
  it("shoud be exported", () => {
    expect(typeof version).toBe("string");
  });
});

describe("createRecorder()", () => {
  it("should return recorder client", async () => {
    fetchMock.postOnce(`${recordingServerHost}/initialize`, initializeResponse);

    const client = await createRecorder();
    expect(client).toBeInstanceOf(Client);
  });

  it("TODO: should throw when invalid apikey passed");
  it("TODO: should throw when invalid credential passed");

  it("should throw when signaling returns invalid response", async done => {
    fetchMock.postOnce(`${recordingServerHost}/initialize`, {});

    await createRecorder()
      .then(() => done.fail("should throw!"))
      .catch(err => {
        console.log(err);
        // TODO: expect(err).toBeInstanceOf(TodoError);
        done();
      });
  });

  it("TODO: should throw when signaling failed by network issue");
});
