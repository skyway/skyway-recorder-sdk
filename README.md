# skyway-recording-sdk

skyway-recording-sdk provides audio recording API that enables you to record your
calls and automatically uploading recording files to Google Cloud Storage
(GCS).

## Enable recording feature on SkyWay Dashboard

- Signup or login to your account.
- Create or edit your application associated with your account.
- Check "Enable recording feature" in the permission section.
- Register a GCS bucket where the recording files will be uploaded.

:warning: If uploading failed even once, SkyWay recording server disable the recording
feature. You can check the current status of the recording feature on SkyWay Dashboard.

## API

### Table of Contents

- [Example](Example)
- [function createRecorder(apiKey, [ options ])](#function-createrecorderapikey--options-)
- [class Recorder extends EventEmitter](#class-recorder-extends-eventemitter)
  - [async recorder.start(track)](#async-recorderstarttrack)
  - [async recorder.stop()](#async-recorderstop)
  - [Event: `abort`](#event-abort)

- [class TypeError](#class-typeerror)
- [class InvalidStateError](#class-invalidstateerror)
- [class AbortError](#class-aborterrror)
- [class RequestError](#class-requesterror)
- [class NetworkError](#class-networkerror)
- [class ServerError](#class-servererror)
  
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
  
| Name               | Type                                                    | Required           | Default | Description                                                                                              |
|:-------------------|:--------------------------------------------------------|:-------------------|:--------|:---------------------------------------------------------------------------------------------------------|
| auth               | auth object                                             |                    |         | Information to authenticate recording. If API key authentication is enabled, this parameter is required. |
| iceServers         | array of [RTCIceServer][RTCIceServer]                   |                    |         | TURN servers that can be used by the ICE Agent. SkyWay ice servers are used by default.                  |
| iceTransportPolicy | array of [RTCIceTransportPolicy][RTCIceTransportPolicy] |                    | `all`   | `all` and `relay` are supported. `relay` indicates ICE engine only use relay candidates.                 |

###### auth object
It is calculated using the HMAC-SHA256 algorithm on the string `timestamp`, with the secret key for the app.
The final value should be in base64 string format.

| Name       | Type   | Required           | Default | Description                                                                                  |
|:-----------|:-------|:-------------------|:--------|:---------------------------------------------------------------------------------------------|
| credential | string | :heavy_check_mark: |         | The HMAC credential for API key authentication.                                              |
| timestamp  | string | :heavy_check_mark: |         | The UNIX timestamp which used to calculate credential. <br> `timestamp` must be a 10 digits. |

##### Return value
An instance of type `Recorder`.

##### Exceptions
`TypeError` is thrown, if invalid parameters are given.

---

### class Recorder extends EventEmitter
The `Recorder` class is used for recording a audio track via SkyWay recording server.

An instance of type `Recorder` should be constructed via createRecorder(apiKey, [options])

#### recorder.state **readonly**
An instance of type `RecorderState`

##### RecorderState
`RecorderState` represents the current state of an instance of Recorder.

Transitions are:
- createRecorder(apiKey, [options]): `new` [initial state]
- start(track): `recording`
- stop(): `closed`


`RecorderState` transitions diagram is shown below.
```
-- new Recorder(apiKey, [options]) --> "new" -- start(track) --> "recording" -- stop() --> "closed"
```

Note that recorder is not reuse to recording a track.

#### async recorder.start(track)
`recorder.start(track)` starts recording a given **audio** track.
If the recording is successfully started, `recorder.state` changes to `recording`.

##### Parameters

| Name  | Type                                 | Required           | Default | Description                  |
|:------|:-------------------------------------|:-------------------|:--------|:-----------------------------|
| track | [MediaStreamTrack][MediaStreamTrack] | :heavy_check_mark: |         | A MediaStreamTrack to record |

##### Return value
The recording ID which is used as the uploading file path of the audio recording file.

##### Exceptions

- `TypeError` is thrown if invalid type for parameters are given as follows:
  - `track` is not passed or falsy
  - `track.kind` is not equal to `audio`. Note that `video` is not supported.
- `InvalidStateError` is thrown if `recorder.state` isn't `new`.
- `RequestError` is thrown if invalid request parameter was given as follows:
  - The application associated with the given `apiKey` does not found.
  - The given credential does not match to computed credentials by SkyWay server.
  - etc.
- `NetworkError` is thrown, if request for SkyWay backend server failed due to network issues.
- `ServerError` is thrown, if the SkyWay server encountered an internal error.


#### async recorder.stop()
`recorder.stop()` stops recording.
If the recording is successfully stoped, `recorder.state` changes to "closed".

After the recording is stopped, SkyWay recording server is going to upload the
recording audio file into the bucket of Google Cloud Storage specified in SkyWay
Dashboard. The uploaded filename is equal to the recording ID.

##### Return value
`undefined`

##### Exceptions
- `InvalidStateError` is thrown, if `recorder.state` is not `recording`.
- `RequestError` is thrown if invalid request parameter was given as follows:
  - The application associated with the given `apiKey` does not found.
  - The given credential does not match to computed credentials by SkyWay server.
- `NetworkError` is thrown, if request for SkyWay backend server failed due to network issues.
- `ServerError` is thrown, if the SkyWay server encountered an internal error.


#### Event: `abort`
The `abort` event is emitted when the following errors occured during a recording.

- Disconnected from server for any reason. The possible causes include:
  - Network issue,
  - Recording exceeding the maximum recordable time of audio track.
- Transport closed by server error.
- Recording track ended.

#### class TypeError
The `TypeError` class is used for reports errors that arise because a parameter has incorrect type.

#### class InvalidStateError
The `TypeError` class is used for reports errors that arise because a method is called with an invalid state.

#### class AbortError
The `AbortError` class is used for reports errors that arise because a request is aborted. For example, the `AbortError` is thrown if an externally stopping the audio track being transmitted caused by the disconnection of microphones associated with the recording.

#### class RequestError
The `TypeError` class is used for reports errors that arise because invalid request parameters are given.

#### class NetworkError
The `TypeError` class is used for reports errors that arise because a request failed due to network issues.

#### class ServerError
The `TypeError` class is used for reports errors that arise because a requested SkyWay server encountered an internal error.

[MediaStreamTrack]:https://w3c.github.io/webrtc-pc/#mediastreamtrack
[RTCIceServer]:https://w3c.github.io/webrtc-pc/#dom-rtciceserver
[RTCIceTransportPolicy]:https://w3c.github.io/webrtc-pc/#rtcicetransportpolicy-enum
