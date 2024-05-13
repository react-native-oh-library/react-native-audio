import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

type AudioQualityType = 'Low' | 'Medium' | 'High';

export interface RecordingOptions {
    SampleRate: Double,
    Channels: Int32,
    AudioQuality?: AudioQualityType,
    AudioEncoding: string,
    MeteringEnabled?: boolean,
    MeasurementMode?: boolean,
    AudioEncodingBitRate: Double,
    IncludeBase64: boolean,
    OutputFormat: string,
    AudioSource: Int32
}

export interface PathMap {
    FilesDirectoryPath: string,
    CacheDirectoryPath: string,
    TempsDirectoryPath: string,
}

export interface Spec extends TurboModule {
    prepareRecordingAtPath: (path: string, options: RecordingOptions) => Promise<void>;
    requestAuthorization: () => Promise<boolean>;
    startRecording: () => Promise<void>;
    pauseRecording: () => Promise<void>;
    resumeRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    getAllPath: () => PathMap;
    checkAuthorizationStatus: () => Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RTNAudio");