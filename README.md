# skyway-recording-sdk

skyway-recording-sdk provides audio recording API that enables you to record your
calls and automatically uploading recording files to Google Cloud Storage
(GCS).

## Enable recording feature on SkyWay Dashboard

- Signup or login to your account.
- Create or edit your application associated with your account.
- Check "Enable recording feature" in the permission section.
- Register a GCS bucket where the recording files will be uploaded.

Note: If uploading failed even once, SkyWay recording server disable the recording
feature. You can check the current status of the recording feature on SkyWay Dashboard.

## API

### Table of Contents

- Example
- function createRecorder(apiKey, [ options ])
- class Recorder extends EventEmitter
  - async recorder.start(track)
  - async recorder.stop()
  - Event: `abort`
  
---

### Example

```js
import { createRecorder } from "skyway-js-recorder";

(async () => {
  const apiKey = "5bea388b-3f95-4e1e-acb5-a34efdd0c480";
  const recorder = await createRecorder(apiKey);

  // if use authentication
  // const recorder = await createRecorder(apiKey, { auth: { timestamp, credential } });
  // if use custom ICE configuration
  // const recorder = await createRecorder(apiKey, { iceServers: [], iceTransportPolicy: "relay" });

  const track = await navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(s => s.getTracks()[0]);

  const res = await recorder.start(track);
  console.log(`Your recording id: ${res.id} is now recording...`);

  // ...

  await recorder.stop();
  console.log("recording has stopped!");
  console.log("uploading will be started soon...");
})();
```

---

### function createRecorder(apiKey, [ options ])
Construct an object of type `Recorder`.

##### Parameters

| Name    | Type             | Required           | Default | Description        |
|:--------|:-----------------|:-------------------|:--------|:-------------------|
| apiKey  | string           | :heavy_check_mark: |         |                    |
| options | options object   |                    |         |                    |

###### options object
  
| Name               | Type                                                    | Required           | Default | Description                                     |
|:-------------------|:--------------------------------------------------------|:-------------------|:--------|:------------------------------------------------|
| auth               | auth object                                             |                    |         | Information to authenticate recording. If API key authentication is enabled, this parameter is required. |
| iceServers         | array of [RTCIceServer][RTCIceServer]                   |                    |         | TURN servers that can be used by the ICE Agent. SkyWay ice servers are used by default.                  |
| iceTransportPolicy | array of [RTCIceTransportPolicy][RTCIceTransportPolicy] |                    | 'all'   | Force TURN ('relay') or not ('all')                                                                      |

###### auth object
It is calculated using the HMAC-SHA256 algorithm on the string `$timestamp`, with the secret key for the app.
The final value should be in base64 string format.

| Name       | Type   | Required           | Default | Description                                                                                  |
|:-----------|:-------|:-------------------|:--------|:---------------------------------------------------------------------------------------------|
| credential | string | :heavy_check_mark: |         | The HMAC credential for API key authentication.                                              |
| timestamp  | string | :heavy_check_mark: |         | The UNIX timestamp which used to calculate credential. <br> `timestamp` must be a 10 digits. |

##### Return value
An instance of type `Recorder`.

##### Exceptions
If invalid parameters are given, `TypeError` is thrown.

---

### class Recorder extends EventEmitter
The `Recorder` class is used for recording a audio track via SkyWay recording server.

An instance of type `Recorder` should be constructed via createRecorder(apiKey, [options])

#### recorder.state **readonly**
An instance of type `RecorderState`

##### RecorderState
`RecorderState` represents the current state of an instance of Recorder.

Transitions are:
- createRecorder(apiKey, [options]): "new" [initial state]
- start(track): "recording"
- stop(): "closed"


`RecorderState` transitions diagram is shown below.
```
-- new Recorder(apiKey, [options]) --> "new" -- start(track) --> "recording" -- stop() --> "closed"
                                                                          ^                    |
                                                                          |___ start(track) ___|
```

#### async recorder.start(track)
`recorder.start(track)` starts recording a given **audio** track.
If the recording is successfully started, `recorder.state` changes to "recording".

##### Parameters

| Name  | Type                                 | Required           | Default | Description                  |
|:------|:-------------------------------------|:-------------------|:--------|:-----------------------------|
| track | [MediaStreamTrack][MediaStreamTrack] | :heavy_check_mark: |         | A MediaStreamTrack to record |

##### Return value
The recording ID which is used as the uploading file path of the audio recording file.

##### Exceptions
May throw `TypeError` or `InvalidStateError` as follows:
- If invalid parameters are given, `TypeError` is thrown.
- If `recorder.state` is already set to `recording`, `InvalidStateError` is thrown.


#### async recorder.stop()
`recorder.stop()` stops recording.
If the recording is successfully stoped, `recorder.state` changes to "closed".

After the recording is stopped, SkyWay recording server is going to upload the
recording audio file into the bucket of Google Cloud Storage specified in SkyWay
Dashboard. The uploaded filename is equal to the recording ID.

##### Return value
`undefined`

##### Exceptions
If recorder.state is not `recording`, `InvalidStateError` is thrown.

#### Event: `abort`
The `abort` event is emitted when the following errors occured during a recording.

- Disconnected from server for any reason. The possible causes include:
  - Network issue,
  - Recording exceeding the maximum recordable time of audio track.
- Transport closed by server error.
- Recording track ended.


[MediaStreamTrack]:https://w3c.github.io/webrtc-pc/#mediastreamtrack
[RTCIceServer]:https://w3c.github.io/webrtc-pc/#dom-rtciceserver
[RTCIceTransportPolicy]:https://w3c.github.io/webrtc-pc/#rtcicetransportpolicy-enum
