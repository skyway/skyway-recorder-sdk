// load module is enough for checking d.ts itself
import { createRecorder, errors } from ".";

// use typings for extra assertion, check exported or NOT
// import { expectType } from "tsd";
import { AbortError, RecorderOptions } from ".";

(async () => {
  const options: RecorderOptions = {};
  if (true) {
    options.auth = { timestamp: 1234567890, credential: "" };
  };

  const recorder = await createRecorder(options);

  recorder.on("abort", (err: AbortError) => {});
});
