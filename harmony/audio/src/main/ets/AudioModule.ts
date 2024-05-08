import { TurboModule } from "@rnoh/react-native-openharmony/ts";
import type { RNOHContext } from "@rnoh/react-native-openharmony/ts";
import { AudioRecordManager } from './AudioRecordManager';
import { RecordingOptions, PathMap } from './AudioType';

export class AudioModule extends TurboModule {
  ctx!: RNOHContext;
  audioRecorderManager: AudioRecordManager = new AudioRecordManager(this.ctx);

  prepareRecordingAtPath(path: string, options: RecordingOptions) {
    this.audioRecorderManager.prepareRecordingAtPath(path, options);
  }

  startRecording() {
    this.audioRecorderManager.startRecording();
  }

  pauseRecording() {
    this.audioRecorderManager.pauseRecording();
  }

  resumeRecording() {
    this.audioRecorderManager.resumeRecording();
  }

  stopRecording() {
    this.audioRecorderManager.stopRecording();
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
