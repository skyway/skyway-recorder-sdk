# skyway-recording-sdk

## API
```js
import { createRecorder } from "skyway-js-recorder";

(async () => {
  const apiKey = "5bea388b-3f95-4e1e-acb5-a34efdd0c480";
  const recorder = await createRecorder(apiKey);

  const track = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => s.getTracks()[0]);

  const res = await recorder.start(track);
  console.log(`${res.id}.ogg is now recording...`);


  // ...

  recorder.stop();
  console.log("recording is stopped");
  console.log("uploading will be started soon...");
})();
```
