# SkyWay Recorder
`skyway-js-recorder` provides audio recording API.
The recorded files will be uploaded to Google Cloud Storage(GCS).

## Prerequisite

You need to enable recording feature on SkyWay Dashboard.

- Signup or login to your account.
- Create or edit your application associated with your account.
- Check `Enable recording feature` in the permission section.
- Register a GCS bucket where the recording files will be uploaded.

:warning: If uploading failed even once, SkyWay recording server disable the recording feature.
You can check the current status of the recording feature on SkyWay Dashboard.

## Install

```sh
npm i skyway-js-recorder
```

CDN is also available.

```
<script src="https://cdn.webrtc.ecl.ntt.com/skyway-recorder-latest.js"></script>
```

You do NOT need to install SkyWay JS-SDK alongside.

## Example

```js
import { createRecorder } from "skyway-js-recorder";

(async () => {
  const apiKey = "5bea388b-3f95-4e1e-acb5-a34efdd0c480";
  const recorder = createRecorder(apiKey);

  // if use authentication
  // const recorder = createRecorder(apiKey, { auth: { timestamp, credential } });
  // if use custom ICE configuration
  // const recorder = createRecorder(apiKey, { iceServers: [], iceTransportPolicy: "relay" });

  const track = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => s.getAudioTracks()[0]);

  const res = await recorder.start(track);
  console.log(`Your recording id: ${res.id} is now recording...`);

  // ...

  await recorder.stop();
  console.log("recording has stopped!");
  console.log("uploading will be started soon...");
})();
```

## API

See [API.md](./api.md) for details.

