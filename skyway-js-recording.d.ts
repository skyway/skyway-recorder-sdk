// TODO: check actually

import EventEmitter from "eventemitter3";

declare type RecorderState = "new" | "recording" | "closed";

declare class Recorder extends EventEmitter {
  readonly state: RecorderState;

  start(track: MediaStreamTrack): Promise<{ id: string }>;
  stop(): Promise<void>;
}

export interface RecorderOptions {
  auth?: {
    timestamp: number;
    credential: string;
  };
  iceServers?: RTCIceServers[];
  iceTransportPolicy?: RTCIceTransportPolicy;
}

export declare function createRecorder(options?: RecorderOptions): Recorder;

// TODO: how to define and export ...?
export declare const errors = {
  AbortError: Error;
};
