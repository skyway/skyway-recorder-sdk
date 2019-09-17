import { Device } from "mediasoup-client";

export default class Recorder {
  constructor() {
    this._state = "new";
    this._device = new Device();
  }

  async setup(routerCapabilities, transportInfo) {
    console.warn(routerCapabilities, transportInfo);
  }

  start(track) {
    track;
  }

  stop() {}
}
