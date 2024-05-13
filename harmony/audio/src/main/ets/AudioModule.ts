import { TurboModule } from "@rnoh/react-native-openharmony/ts";
import type { RNOHContext } from "@rnoh/react-native-openharmony/ts";
import { AudioRecordManager } from './AudioRecordManager';
import { RecordingOptions, PathMap } from './AudioType';

export class AudioModule extends TurboModule {
  ctx!: RNOHContext;
  audioRecorderManager: AudioRecordManager = new AudioRecordManager(this.ctx);

  prepareRecordingAtPath(path: string, options: RecordingOptions): Promise<void> {
    return this.audioRecorderManager.prepareRecordingAtPath(path, options);
  }

  startRecording(): Promise<void> {
    return this.audioRecorderManager.startRecording();
  }

  pauseRecording(): Promise<void> {
    return this.audioRecorderManager.pauseRecording();
  }

  resumeRecording(): Promise<void> {
    return this.audioRecorderManager.resumeRecording();
  }

  stopRecording(): Promise<void> {
    return this.audioRecorderManager.stopRecording();
  }

  requestAuthorization(): Promise<boolean> {
    return this.audioRecorderManager.requestAuthorization();
  }

  getAllPath(): PathMap {
    return this.audioRecorderManager.getAllPath();
  }

  checkAuthorizationStatus(): Promise<boolean> {
    return this.audioRecorderManager.checkAuthorizationStatus();
  }
}
