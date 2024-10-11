/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule } from "@rnoh/react-native-openharmony/ts";
import type { TurboModuleContext } from "@rnoh/react-native-openharmony/ts";
import { AudioRecordManager } from './AudioRecordManager';
import { RecordingOptions, PathMap } from './AudioType';
import { TM } from "@rnoh/react-native-openharmony/generated/ts";

export class AudioModule extends TurboModule implements TM.RTNAudio.Spec {
  ctx!: TurboModuleContext;
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
