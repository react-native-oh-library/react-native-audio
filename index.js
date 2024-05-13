'use strict';

import React from "react";

import ReactNative, {
  NativeModules,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform
} from "react-native";

// @ts-ignore We want to check whether __turboModuleProxy exitst, it may not
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const nativeRecorderManager = isTurboModuleEnabled ?
  require("./NativeAudio").default :
  NativeModules.AudioRecorderManager;

const AudioRecorder = {
  prepareRecordingAtPath: function (path, options) {
    if (this.progressSubscription) this.progressSubscription.remove();
    this.progressSubscription = DeviceEventEmitter.addListener('recordingProgress',
      (data) => {
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );

    if (this.finishedSubscription) this.finishedSubscription.remove();
    this.finishedSubscription = DeviceEventEmitter.addListener('recordingFinished',
      (data) => {
        if (this.onFinished) {
          this.onFinished(data);
        }
      }
    );

    const defaultOptions = {
      SampleRate: 48000,
      Channels: 2,
      AudioQuality: 'High',
      AudioEncoding: 'ima4',
      OutputFormat: 'mpeg_4',
      MeteringEnabled: false,
      MeasurementMode: false,
      AudioEncodingBitRate: 100000,
      IncludeBase64: false,
      AudioSource: 0
    };

    const recordingOptions = { ...defaultOptions, ...options };

    if (Platform.OS === 'ios') {
      nativeRecorderManager.prepareRecordingAtPath(
        path,
        recordingOptions.SampleRate,
        recordingOptions.Channels,
        recordingOptions.AudioQuality,
        recordingOptions.AudioEncoding,
        recordingOptions.MeteringEnabled,
        recordingOptions.MeasurementMode,
        recordingOptions.IncludeBase64
      );
    } else {
      return nativeRecorderManager.prepareRecordingAtPath(path, recordingOptions);
    }
  },
  startRecording: function () {
    return nativeRecorderManager.startRecording();
  },
  pauseRecording: function () {
    return nativeRecorderManager.pauseRecording();
  },
  resumeRecording: function () {
    return nativeRecorderManager.resumeRecording();
  },
  stopRecording: async function () {
    await nativeRecorderManager.stopRecording();
    const timer = setTimeout(()=>{
      this.removeListeners();
      this.clearCallback();
      clearTimeout(timer);
    },200)
  },
  checkAuthorizationStatus: nativeRecorderManager.checkAuthorizationStatus,
  requestAuthorization: async () => {
    if (Platform.OS === 'ios')
      return nativeRecorderManager.requestAuthorization();
    else if (Platform.OS === 'harmony') {
      const res = await nativeRecorderManager.requestAuthorization();
      return res;
    } else {
      return new Promise((resolve, reject) => {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ).then(result => {
          if (result == PermissionsAndroid.RESULTS.GRANTED || result == true)
            resolve(true);
          else
            resolve(false)
        })
      });
    }
  },
  getAllPath: function () {
    const res = nativeRecorderManager.getAllPath();
    return res;
  },
  removeListeners: function () {
    if (this.progressSubscription) this.progressSubscription.remove();
    if (this.finishedSubscription) this.finishedSubscription.remove();
  },
  clearCallback: function () {
    if (this.onProgress) this.onProgress = null;
    if (this.onFinished) this.onFinished = null;
  }
};

let AudioUtils = {};
let AudioSource = {};

if (Platform.OS === 'ios') {
  AudioUtils = {
    MainBundlePath: nativeRecorderManager.MainBundlePath,
    CachesDirectoryPath: nativeRecorderManager.NSCachesDirectoryPath,
    DocumentDirectoryPath: nativeRecorderManager.NSDocumentDirectoryPath,
    LibraryDirectoryPath: nativeRecorderManager.NSLibraryDirectoryPath,
  };
} else if (Platform.OS === 'harmony') {
  const { FilesDirectoryPath, CacheDirectoryPath, TempsDirectoryPath } = AudioRecorder.getAllPath();
  AudioUtils = {
    FilesDirectoryPath,
    CacheDirectoryPath,
    TempsDirectoryPath
  }
  AudioSource = {
    DEFAULT: 0,
    MIC: 1,
  }
} else if (Platform.OS === 'android') {
  AudioUtils = {
    MainBundlePath: nativeRecorderManager.MainBundlePath,
    CachesDirectoryPath: nativeRecorderManager.CachesDirectoryPath,
    DocumentDirectoryPath: nativeRecorderManager.DocumentDirectoryPath,
    LibraryDirectoryPath: nativeRecorderManager.LibraryDirectoryPath,
    PicturesDirectoryPath: nativeRecorderManager.PicturesDirectoryPath,
    MusicDirectoryPath: nativeRecorderManager.MusicDirectoryPath,
    DownloadsDirectoryPath: nativeRecorderManager.DownloadsDirectoryPath
  };
  AudioSource = {
    DEFAULT: 0,
    MIC: 1,
    VOICE_UPLINK: 2,
    VOICE_DOWNLINK: 3,
    VOICE_CALL: 4,
    CAMCORDER: 5,
    VOICE_RECOGNITION: 6,
    VOICE_COMMUNICATION: 7,
    REMOTE_SUBMIX: 8, // added in API 19
    UNPROCESSED: 9, // added in API 24
  };
}

module.exports = { AudioRecorder, AudioUtils, AudioSource };
