import { RNOHContext, TurboModule } from "rnoh/ts";
import { AudioRecordManager, PathMap } from './AudioRecordManager';
import { RecordingOptions } from './AudioType';

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
