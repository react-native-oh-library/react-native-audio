type AudioQuality = 'Low' | 'Medium' | 'High';

export interface RecordingOptions {
  SampleRate: number,
  Channels: number,
  AudioQuality?: AudioQuality,
  AudioEncoding: string,
  MeteringEnabled?: boolean,
  MeasurementMode?: boolean,
  AudioEncodingBitRate: number,
  IncludeBase64: boolean,
  OutputFormat: string,
  AudioSource: number
}

export interface PathMap {
  FilesDirectoryPath: string,
  CacheDirectoryPath: string,
  TempsDirectoryPath: string,
}
