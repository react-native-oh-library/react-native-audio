export interface DefaultOptions {
  SampleRate: number,
  Channels: number,
  AudioQuality: 'Low' | 'Medium' | 'High',
  AudioEncoding: string,
  OutputFormat: string,
  MeteringEnabled: boolean,
  MeasurementMode: boolean,
  AudioEncodingBitRate: number,
  IncludeBase64: boolean,
  AudioSource: number
}

export interface CustomerOptions {
  SampleRate?: number,
  Channels: number,
  AudioQuality?: 'Low' | 'Medium' | 'High',
  AudioEncoding: string,
  MeteringEnabled?: boolean, // only ios
  MeasurementMode?: boolean, // only ios
  AudioEncodingBitRate: number, // only android
  IncludeBase64?: boolean,
}

export type RecordingOptions = DefaultOptions & CustomerOptions;

export type AVRecorderState = 'idle' | 'prepared' | 'started' | 'paused' | 'stopped' | 'released' | 'error';
