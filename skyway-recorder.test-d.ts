// load module is enough for checking d.ts itself
import { createRecorder, errors } from ".";

// use typings for extra assertion, check exported or NOT
// import { expectType } from "tsd";
import { AbortError, RecorderOptions } from ".";

async () => {
  const apikey = "xxxxxx-xxxx-xxxxxxxx";
  const options: RecorderOptions = {};
  if (true) {
    options.auth = { timestamp: 1234567890, credential: "" };
  }

  const recorder1 = await createRecorder(apikey, options);
  const recorder2 = await createRecorder(apikey, options);

  recorder1.on("abort", (err: AbortError) => {});
  const track = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => s.getTracks()[0]);
  await recorder2.start(track);
};
