```js
class Signaling {
  connect() {}
  produce() {}
  stop() {}
}
class Recorder {
  state = "new"; // "initizalized" | "started" | "stopped"

  async initialize({ routerCap, connectParams }) {
    this._device = new Device();
    await this._device.load(routerCap);
    this._transport = this._device.createSendTransport(tranportId, connectParams);
    this._transport.on("connect", this._signaling.connect);
    this._transport.on("produce", this._signaling.produce);
  }
  async start(track) {
    const producer = await this._transpport.produce(track);
    return producer.id
  }
  async stop() {
    await this._signaling.stop();
  }
}
```

```js
async createRecorder(apikey, credential) {
  // todo: validate apikey
  // todo: validate credential
  const res = await fetch(`${recordingLB}?apikey=${apikey}`);
  const {
    sessionToken,
    fqdn,
    routerCap,
    connectParams
  } = await res.json();

  const signaling = new Signaling({ sessionToken, fqdn });
  const recorder = new Recorder(signaling);
  await record.initialize({ routerCap, connectParams })
  return recorder;
}
```

```js
import { createRecorder } from "skyway-js-recorder";

const recorder = await createRecorder(apikey, credential);
recorder.start(track);
recorder.stop();

// throws: need another recorder
recorder.start();
// except for calling stop()
recorder.on("stop", () => {});
```
