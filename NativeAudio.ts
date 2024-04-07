import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface DefaultOptions {
    SampleRate: number,//音频采样率 audioSampleRate
    Channels: number,//音频省道数 audioChannels
    AudioQuality: 'Low' | 'Medium' | 'High'
    AudioEncoding: string,//音频编码格式，当前只支持aac audioCodec
    OutputFormat: string,//封装格式 fileFormat
    MeteringEnabled: boolean,
    MeasurementMode: boolean,
    AudioEncodingBitRate: number,//音频编码比特率 audioBitrate
    IncludeBase64: boolean,
    AudioSource: number//音频输入源 avConfig.audioSourceType
}

export interface CustomerOptions {
    SampleRate?: number,
    Channels?: number,
    AudioQuality?: 'Low' | 'Medium' | 'High'
    AudioEncoding?: string,
    MeteringEnabled?: boolean,//only ios
    MeasurementMode?: boolean,//only ios
    AudioEncodingBitRate?: number,//only android
    IncludeBase64?: boolean,
}

export type RecordingOptions = DefaultOptions & CustomerOptions;

export interface PathMap {
    FilesDirectoryPath: string,
    CacheDirectoryPath: string,
    TempsDirectoryPath: string,
}

export interface Spec extends TurboModule {
    prepareRecordingAtPath(path: string, options: RecordingOptions): Promise<void>;
    requestAuthorization(): Promise<boolean>;
    startRecording(): Promise<void>;
    pauseRecording(): Promise<void>;
    resumeRecording(): Promise<void>;
    stopRecording(): Promise<void>;
    getAllPath(): PathMap;
    checkAuthorizationStatus(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RTNAudio");