# API

This module exports only one function and error objects.

- [function createRecorder(apiKey, [ options ])](#function-createrecorderapikey--options-)
- [errors](#errors)

## function createRecorder(apiKey, [ options ])

Construct an object of type [Recorder](#class-recorder-extends-eventemitter).

### Parameters
| Name    | Type             | Required           | Default | Description                            |
|:--------|:-----------------|:------------------:|:-------:|:---------------------------------------|
| apiKey  | string           | :white_check_mark: |         | API key associated with you account.   |
| options | options object   |                    |         | See [options object](#options-object). |

#### options object
| Name               | Type                                                    | Required           | Default | Description                                                                                              |
|:-------------------|:--------------------------------------------------------|:------------------:|:-------:|:---------------------------------------------------------------------------------------------------------|
| auth               | auth object                                             |                    |         | Information to authenticate recording. If API key authentication is enabled, this parameter is required. |
| iceServers         | [RTCIceServer][RTCIceServer][]                          |                    |         | TURN servers that can be used by the ICE Agent. SkyWay ice servers are used by default.                  |
| iceTransportPolicy | [RTCIceTransportPolicy][RTCIceTransportPolicy][]        |                    | `all`   | `all` and `relay` are supported. `relay` indicates ICE engine only use relay candidates.                 |

#### auth object
It is calculated using the HMAC-SHA256 algorithm on the string `timestamp`, with the secret key for the app.
The final value should be in base64 string format.

| Name       | Type   | Required           | Default | Description                                                                                  |
|:-----------|:-------|:------------------:|:-------:|:---------------------------------------------------------------------------------------------|
| credential | string | :white_check_mark: |         | The HMAC credential for API key authentication.                                              |
| timestamp  | string | :white_check_mark: |         | The UNIX timestamp which used to calculate credential. <br> `timestamp` must be a 10 digits. |

Sample code to generate credential using Node.js looks like this.

```js
const credential = require("crypto")
  .createHmac("sha256", YOUR_SECRET_KEY)
  .update(timestamp)
  .digest("base64");
```

### Return value
An instance of type [Recorder](#class-recorder-extends-eventemitter).

### Exceptions
`TypeError` is thrown, if invalid parameters are given.

## errors

This object contains below members.

- [class TypeError](#class-typeerror)
- [class InvalidStateError](#class-invalidstateerror)
- [class AbortError](#class-aborterrror)
- [class RequestError](#class-requesterror)
- [class NetworkError](#class-networkerror)
- [class ServerError](#class-servererror)

- - - 

## class Recorder extends EventEmitter
The `Recorder` class is used for recording a audio track via SkyWay recording server.

An instance of type `Recorder` should be constructed via `createRecorder(apiKey, [options])`

### recorder.state **readonly**
An instance of type `RecorderState`

#### RecorderState
`RecorderState` represents the current state of an instance of Recorder.

Transitions are:
- createRecorder(apiKey, [options]): `new` [initial state]
- start(track): `recording`
- stop(): `closed`

`RecorderState` transitions diagram is shown below.
```
-- new Recorder(apiKey, [options]) --> "new" -- start(track) --> "recording" -- stop() --> "closed"
```

:warning: You can not reuse a recorder for recording tracks.

### async recorder.start(track)
`recorder.start(track)` starts recording a given **audio** track.
If the recording is successfully started, `recorder.state` changes to `recording`.

#### Parameters
| Name  | Type                                 | Required           | Default | Description                  |
|:------|:-------------------------------------|:------------------:|:-------:|:-----------------------------|
| track | [MediaStreamTrack][MediaStreamTrack] | :white_check_mark: |         | A MediaStreamTrack to record |

#### Return value
The recording ID which is used as the uploading file path of the audio recording file.

#### Exceptions
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

### async recorder.stop()
`recorder.stop()` stops recording. If the recording is successfully stoped, `recorder.state` changes to `closed`.

After the recording is stopped, SkyWay recording server is going to upload the recording audio file into the bucket of Google Cloud Storage specified in SkyWay Dashboard. The uploaded filename is equal to the recording ID.

#### Return value
`undefined`

#### Exceptions
- `InvalidStateError` is thrown, if `recorder.state` is not `recording`.
- `RequestError` is thrown if invalid request parameter was given as follows:
  - The application associated with the given `apiKey` does not found.
  - The given credential does not match to computed credentials by SkyWay server.
- `NetworkError` is thrown, if request for SkyWay backend server failed due to network issues.
- `ServerError` is thrown, if the SkyWay server encountered an internal error.

#### Notes

- `recorder.stop()` calls `track.stop()` internally
  - you may want to call `track.clone()` before `recorder.start(track)`
- if you call `recorder.stop()` too early after started, it may fail to record

### Event: `abort`
The `abort` event is emitted when the following errors occured during a recording.

- Disconnected from server for any reason. The possible causes include:
  - Network issue,
  - Recording exceeding the maximum recordable time of audio track.
- Transport closed by server error.
- Recording track ended.

## class TypeError
The `TypeError` class is used for reports errors that arise because a parameter has incorrect type.

## class InvalidStateError
The `InvalidStateError` class is used for reports errors that arise because a method is called with an invalid state.

## class AbortError
The `AbortError` class is used for reports errors that arise because a request is aborted. For example, the `AbortError` is thrown if an externally stopping the audio track being transmitted caused by the disconnection of microphones associated with the recording.

## class RequestError
The `RequestError` class is used for reports errors that arise because invalid request parameters are given.

## class NetworkError
The `NetworkError` class is used for reports errors that arise because a request failed due to network issues.

## class ServerError
The `ServerError` class is used for reports errors that arise because a requested SkyWay server encountered an internal error.

[MediaStreamTrack]:https://w3c.github.io/webrtc-pc/#mediastreamtrack
[RTCIceServer]:https://w3c.github.io/webrtc-pc/#dom-rtciceserver
[RTCIceTransportPolicy]:https://w3c.github.io/webrtc-pc/#rtcicetransportpolicy-enum
