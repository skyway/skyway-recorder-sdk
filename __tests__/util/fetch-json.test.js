const fetchJSON = require("../../src/util/fetch-json");
// easier than using jest.mock()
const fetchMock = require("fetch-mock");

afterEach(fetchMock.reset);

test("should fetch w/ method, url", async () => {
  fetchMock.getOnce("/getter", { ok: 1 });

  await fetchJSON("GET", "/getter", {});
  const [url, options] = fetchMock.lastCall();
  expect(url).toBe("/getter");
  expect(options.method).toBe("GET");
});

test("should fetch w/ default header", async () => {
  fetchMock.postOnce("/postter", { ok: 1 });

  await fetchJSON("POST", "/postter", {}, {});
  const [url, options] = fetchMock.lastCall();
  expect(url).toBe("/postter");
  expect(options.headers).toHaveProperty("Content-Type", "application/json");
});

test("should fetch w/ extend header", async () => {
  fetchMock.postOnce("/postter", { ok: 1 });

  await fetchJSON("POST", "/postter", { "My-Name": ";D" }, {});
  const [url, options] = fetchMock.lastCall();
  expect(url).toBe("/postter");
  expect(options.headers).toHaveProperty("Content-Type", "application/json");
  expect(options.headers).toHaveProperty("My-Name", ";D");
});

test("should fetch w/ stringified body", async () => {
  fetchMock.postOnce("/postter", { ok: 1 });

  await fetchJSON("POST", "/postter", {}, { hello: "world" });
  const [url, options] = fetchMock.lastCall();
  expect(url).toBe("/postter");
  expect(options.body).toBe(JSON.stringify({ hello: "world" }));
});

test("should return status and data", async () => {
  fetchMock.getOnce("/getter", { ok: 1 });

  const res = await fetchJSON("GET", "/getter", {});
  expect(res).toEqual({ status: 200, data: { ok: 1 } });
});

test("should throw error if fetch() throws", async done => {
  fetchMock.postOnce("/postter", { throws: new Error("Failed to fetch...") });

  await fetchJSON("POST", "/postter", {})
    .then(() => done.fail("should reject"))
    .catch(err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch("Failed");
      done();
    });
});
