# skyway-recording-sdk

## API

### Table of Contents

- Example
- [function createRecorder(apiKey, [ options ])][1]
- [class Recorder extends EventEmitter][2]
  - [async recorder.start(track)][3]
  - [async recorder.stop()][4]
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
Construct an object of type Recorder.

##### Parameters

| Name      | Type                             | Required           | Default | Description        |
|:----------|:---------------------------------|:-------------------|:--------|:-------------------|
| `apiKey`  | string                           | :heavy_check_mark: |         |                    |
| `options` | [options object][options-object] |                    |         |                    |

###### options object
  
| Name                 | Type                           | Required           | Default | Description                                    |
|:---------------------|:-------------------------------|:-------------------|:--------|:-----------------------------------------------|
| `auth`               | [auth object][auth-object]            |                    |         | Information to authenticate recording                  |
| `iceServers`         | array of [RTCIceServer][101]          |                    |         | TURN servers that can be used by the ICE Agent      |
| `iceTransportPolicy` | array of [RTCIceTransportPolicy][102] |                    |         | Force TURN or not                                      |

###### auth object

| Name         | Type   | Required           | Default | Description                                       |
|:-------------|:-------|:-------------------|:--------|:--------------------------------------------------|
| `credential` | string | :heavy_check_mark: |         | The HMAC credential for API key authentication.        |
| `timestamp`  | string | :heavy_check_mark: |         | The UNIX timestamp which used to calculate credential. <br> `timestamp` must be a 10 digits. |

##### Return value
An instance of type [Recorder][2].

##### Exceptions
If invalid parameters are given, `TypeError` is thrown.

---

### class Recorder extends EventEmitter
The Recorder class is used for recording a audio track via SkyWay recording server.

An instance of type Recorder should be constructed via [createRecorder(apiKey, [options])][2].

#### recorder.state `readonly`
An instance of type [RecorderState][RecorderState].

##### RecorderState
[RecorderState][RecorderState] represents the current state of an instance of [Recorder][2].

Transitions are:
- [createRecorder(apiKey, [options])][2]: "new" [initial state]
- [start(track)][3]: "recording"
- [stop()][4]: "closed"


[RecorderState][RecorderState] transitions diagram is shown below.
```
-- new Recorder(apiKey, [options]) --> "new" -- start(track) --> "recording" -- stop() --> "closed"
                                                                          ^                    |
                                                                          |___ start(track) ___|
```

#### async recorder.start(track)
[recorder.start(track)][3] starts recording a given **audio** track.
If the recording is successfully started, [recorder.state][recorder.state-`readonly`] changes to "recording".

##### Parameters

| Name    | Type             | Required           | Default | Description                                       |
|:--------|:-----------------|:-------------------|:--------|:-----------------------------|
| `track` | [MediaStreamTrack][103] | :heavy_check_mark: |         | A MediaStreamTrack to record |

##### Return value
The recording ID which is used as the uploading file path of the audio recording file.

##### Exceptions
May throw `TypeError` or `InvalidStateError` as follows:
- If invalid parameters are given, `TypeError` is thrown.
- If `recorder.state` is already set to `recording`, `InvalidStateError` is thrown.


#### async recorder.stop()
[recorder.stop()][4] stops recording.
If the recording is successfully stoped, `recorder.state` changes to "closed".

After the recording is stopped, SkyWay recording server is going to upload the recording audio file into the bucket of Google Cloud Storage specified in SkyWay Dashboard. The uploaded filename is equal to the recording ID.

##### Return value
`undefined`

##### Exceptions
If `recorder.state` is not `recording`, `InvalidStateError` is thrown.

#### Event: `abort`
The `abort` event is emitted when the following errors occured during a recording.

- Disconnected from server for any reason. The possible causes include:
  - Network issue,
  - Recording exceeding the maximum recordable time of audio track.
- Transport closed by server error.
- Recording track ended.


[1]:function-createRecorder(apiKey,-[-options-])
[2]:class-Recorder-extends-EventEmitter
[3]:async-recorder.start(tracl)
[4]:async-recorder.stop()
[101]:https://w3c.github.io/webrtc-pc/#dom-rtciceserver
[102]:https://w3c.github.io/webrtc-pc/#rtcicetransportpolicy-enum
