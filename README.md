# skyway-recording-sdk

## API
```js
import { createRecorder } from "skyway-js-recorder";

(async () => {
  const apiKey = "5bea388b-3f95-4e1e-acb5-a34efdd0c480";
  const client = await createRecorder(apiKey);

  // if use authentication
  // const client = await createRecorder(apiKey, { auth: { timestamp, credential } });
  // if use custom ICE configuration
  // const client = await createRecorder(apiKey, { iceServers: [], iceTransportPolicy: "relay" });

  const track = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => s.getTracks()[0]);

  const res = await client.start(track);
  console.log(`Your recording id: ${res.id} is now recording...`);

  // ...

  await recorder.stop();
  console.log("recording has stopped!");
  console.log("uploading will be started soon...");
})();
```
