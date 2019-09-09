# skyway-recording-sdk

```js
import { createRecorder } from "skyway-js-recorder";

const recorder = await createRecorder(apikey, credential);
recorder.start(track); // create Producer()
recorder.stop();

// throws: need another recorder
recorder.start();
// except for calling stop()
recorder.on("stop", () => {});
```
