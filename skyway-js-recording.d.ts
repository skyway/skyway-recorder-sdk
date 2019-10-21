import EventEmitter from "eventemitter3";

type RecorderState = "new" | "recording" | "closed";

declare class Recorder extends EventEmitter {
  readonly state: RecorderState;

  start(track: MediaStreamTrack): Promise<{ id: string }>;
  stop(): Promise<void>;
}

interface RecorderOptions {
  auth?: {
    timestamp: number;
    credential: string;
  };
  iceServers?: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
}

declare class AbortError extends Error {}
declare class InvalidStateError extends Error {}
declare class NotSupportedError extends Error {}
declare class NetworkError extends Error {}
declare class RequestError extends Error {}
declare class ServerError extends Error {}

/*
 * Exports
 *
 */
export declare function createRecorder(options?: RecorderOptions): Recorder;

export declare const errors = {
  AbortError: AbortError;
  InvalidStateError: InvalidStateError;
  NotSupportedError: NotSupportedError;
  NetworkError: NetworkError;
  RequestError: RequestError;
  ServerError: ServerError;
};
