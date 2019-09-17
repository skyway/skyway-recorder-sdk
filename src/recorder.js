export default class Recorder {
  constructor() {
    this._state = "new";
  }

  async setup(routerCapabilities, transportInfo) {
    console.warn(routerCapabilities, transportInfo);
  }

  start(track) {
    track;
  }

  stop() {}
}
