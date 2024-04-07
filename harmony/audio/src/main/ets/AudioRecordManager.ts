import media from '@ohos.multimedia.media';
import { BusinessError, Callback } from '@ohos.base';
import Logger from './Logger';
import promptAction from '@ohos.promptAction';
import { RecordingOptions, AVRecorderState } from './AudioType';
import fs from '@ohos.file.fs';
import common from '@ohos.app.ability.common';
import bundleManager from '@ohos.bundle.bundleManager';
import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import { RNOHContext } from 'rnoh/ts';
import { StopWatch } from './StopWatch';

const TAG = 'AudioRecorder : ';
const TIP_BOTTOM = 140;
const TOAST_DURATION = 1500;
const PERMISSION_LIST: Array<Permissions> = ['ohos.permission.MICROPHONE'];

enum AVRecorderStateEnum {
  IDLE = 'idle',
  PREPARED = 'prepared',
  STARTED = 'started',
  PAUSED = 'paused',
  STOPED = 'stoped',
  RELEASED = 'released',
  ERROR = 'error'
}

export interface PathMap {
  FilesDirectoryPath: string,
  CacheDirectoryPath: string,
  TempsDirectoryPath: string,
}

export class AudioRecordManager {
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
  private ctx!: RNOHContext;
  private avRecorder: media.AVRecorder = {} as media.AVRecorder;
  private isRecording: boolean = false;
  private avProfile: media.AVRecorderProfile = {
    audioBitrate: 100000, //音频比特率
    audioChannels: 2, //音频声道数
    audioCodec: media.CodecMimeType.AUDIO_AAC, // 音频编码格式，当前只支持aac
    audioSampleRate: 48000, // 音频采样率
    fileFormat: media.ContainerFormatType.CFT_MPEG_4A, //封装格式，当前只支持m4a
  };
  private avConfig: media.AVRecorderConfig = {
    audioSourceType: media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC, //音频输入源，这里设置为麦克风(1)
    profile: this.avProfile,
    url: 'fd://35', //使用fs.openSync()获取文件fd
  };
  private stateUpdateListener?: (state: string) => void;
  private state: AVRecorderState = AVRecorderStateEnum.IDLE;
  private stopWatch: StopWatch = new StopWatch();
  private timer: number | null = null;

  constructor(ctx: RNOHContext) {
    this.ctx = ctx;
  }

  //发布录音状态
  private async notifyStateChanges() {
    if (this.stateUpdateListener) {
      Logger.info(`${TAG} state update. state=${this.state}`);
      this.stateUpdateListener(this.state);
    }
  }

  //设置录音状态订阅
  private setStateUpdateListener(listener: (state: string) => void) {
    Logger.info(`${TAG} state state update listener.`);
    this.stateUpdateListener = listener;
  }

  //开始录制对应的配置
  async prepareRecordingAtPath(path: string, options: RecordingOptions): Promise<void> {
    if (this.isRecording) {
      this.showToast('Please call stopRecording before starting recording.');
      return;
    }
    if (fs.accessSync(path)) {
      this.showToast('The file already exists in the directory.');
      return;
    }
    if (path === '') {
      this.showToast('Invalid path.');
      return;
    }
    if (!this.checkAuthorizationStatus()) {
      this.showToast('Please obtain microphone authorization first.');
      return;
    }
    try {
      //创建录制实例
      this.avRecorder = await media.createAVRecorder();
      //监听状态改变
      this.avRecorder.on('stateChange', (state: AVRecorderState) => {
        this.state = state;
        this.notifyStateChanges();
        Logger.info(`${TAG} current state is ${state}.`);
      })
      //错误上报信息
      this.avRecorder.on('error', (error: BusinessError) => {
        Logger.error(`${TAG} AudioRecorder failed, code is ${error?.code}, message is ${error?.message}.`);
        if (error.code === 5400107) {
          this.showToast(`${TAG} Please call stopRecording before starting recording.`);
        }
      })
      //初始化音频参数
      this.avProfile.audioSampleRate = options.SampleRate;
      this.avProfile.audioChannels = options.Channels;
      this.avProfile.audioCodec = this.getAudioCodecFormatString(options.AudioEncoding);
      this.avProfile.audioBitrate = options.AudioEncodingBitRate;
      this.avProfile.fileFormat = this.getFileFormatFormatString(options.OutputFormat);
      this.avConfig.audioSourceType = this.getAudioSourceFormatString(options.AudioSource);
      //获取应用文件路径
      let file = fs.openSync(path, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
      this.avConfig.url = `fd://${file.fd}`;
      await this.avRecorder.prepare(this.avConfig);
      Logger.info(`${TAG} Recording is prepared.`);
      this.showToast('Recording is prepared.');
    } catch (error) {
      Logger.error(`${TAG} ${JSON.stringify(error)}.`);
    }
  }

  //请求麦克风权限
  async requestAuthorization(): Promise<boolean> {
    let grantStatus: boolean = await this.checkAuthorizationStatus(PERMISSION_LIST[0]);
    let authorizationStatus: boolean = grantStatus;
    if (grantStatus) {
      //已经授权，可以继续访问目标操作
      Logger.info(`${TAG} Already authorized.`);
    } else {
      Logger.info(`${TAG} No authorization.`);
      await this.requestAuth(PERMISSION_LIST);
      authorizationStatus = await this.checkAuthorizationStatus();
    }
    return authorizationStatus;
  }

  //请求权限
  async requestAuth(permissions: Array<Permissions>) {
    let atManager = abilityAccessCtrl.createAtManager();
    try {
      const data = await atManager.requestPermissionsFromUser(this.context, permissions);
      let grantStatus: Array<number> = data.authResults;
      let length: number = grantStatus.length;
      for (let i = 0; i < length; i++) {
        if (grantStatus[i] === 0) {
          //用户授权，可以继续访问目标操作
          Logger.info(`${TAG} Authorization successful.`);
          this.showToast('Authorization successful.');
        } else {
          //用户拒绝授权，提示用户必须授权才能访问当前页面的功能，并引导用户到系统设置中打开相应的权限
          Logger.info(`${TAG} Deny authorization.`);
          this.showToast('Deny authorization! Recording requires authorization. Enter the system settings and turn on microphone permissions.');
          return;
        }
      }
    } catch (error) {
      Logger.error(`${TAG} requestPermissionsFromUser failed, code is ${error?.code}, message is ${error?.message}.`);
    }
  }

  //检查是否授权
  async checkAuthorizationStatus(permission: Permissions = PERMISSION_LIST[0]): Promise<boolean> {
    let atManager = abilityAccessCtrl.createAtManager();
    let grantStatus: abilityAccessCtrl.GrantStatus;
    //获取应用程序的accessTokenID
    let tokenId: number;
    try {
      let bundleInfo: bundleManager.BundleInfo = await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (error) {
      Logger.error(`${TAG} getBundleInfoForSelf failed, code is ${error?.code}, message is ${error?.message}.`);
    }
    //检查应用是否被授予权限
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
    } catch (error) {
      Logger.error(`${TAG} checkAccessToken failed, code is ${error?.code}, message is ${error?.message}.`);
    }
    return grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
  }

  //格式化音频输入源
  getAudioSourceFormatString(audioSource: number) {
    switch (audioSource) {
      case 0:
        return media.AudioSourceType.AUDIO_SOURCE_TYPE_DEFAULT;
      case 1:
        return media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC;
      default:
        this.showToast(`Using media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC : ${media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC}.`);
        return media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC;
    }
  }

  //格式化音频编码格式，当前仅支持aac
  getAudioCodecFormatString(audioEncoding: string) {
    switch (audioEncoding) {
      case 'aac':
        return media.CodecMimeType.AUDIO_AAC;
      default:
        this.showToast(`Using media.CodecMimeType.AUDIO_AAC : ${media.CodecMimeType.AUDIO_AAC}.`);
        return media.CodecMimeType.AUDIO_AAC;
    }
  }

  //格式化封装格式，当前仅支持m4a
  getFileFormatFormatString(fileFormat: string) {
    switch (fileFormat) {
      case 'm4a':
        return media.ContainerFormatType.CFT_MPEG_4A;
      default:
        this.showToast(`Using media.ContainerFormatType.CFT_MPEG_4A : ${media.ContainerFormatType.CFT_MPEG_4A}.`);
        return media.ContainerFormatType.CFT_MPEG_4A;
    }
  }

  //开始录制
  public async startRecording() {
    if (this.avRecorder.state === AVRecorderStateEnum.STARTED || this.avRecorder.state === AVRecorderStateEnum.PAUSED) {
      this.showToast('Please call stopRecording before starting recording.');
      return;
    }
    if (this.avRecorder.state !== AVRecorderStateEnum.PREPARED) {
      this.showToast('Please call prepareRecording before starting recording.');
      return;
    }
    await this.avRecorder.start();
    this.isRecording = true;
    Logger.info(`${TAG} start recording.`);
    this.showToast('start recording.');
    this.stopWatch.reset();
    this.stopWatch.start();
    this.startTimer();
  }

  //暂停录制
  public async pauseRecording() {
    if (this.avRecorder.state === AVRecorderStateEnum.STARTED) { //仅在started状态下调用pause为合理状态切换
      try {
        await this.avRecorder.pause();
        this.stopWatch.stop();
        this.showToast('pause recording.');
      } catch (error) {
        Logger.error(`${TAG} pauseRecording failed, code is ${error?.code}, message is ${error?.message}.`);
      }
    }
  }

  //恢复录制
  public async resumeRecording() {
    if (this.avRecorder.state === AVRecorderStateEnum.PAUSED) { //仅在paused状态下调用resume为合理状态切换
      try {
        await this.avRecorder.resume();
        this.stopWatch.start();
        this.showToast('resume recording.');
      } catch (error) {
        Logger.error(`${TAG} resumeRecording failed. code is ${error?.code}, message is ${error?.message}.`);
      }
    }
  }

  //停止录制
  public async stopRecording() {
    //仅在started或者paused状态下调用stop为合理状态切换
    if (this.avRecorder.state === AVRecorderStateEnum.STARTED || this.avRecorder.state === AVRecorderStateEnum.PAUSED) {
      await this.avRecorder.stop();
    }
    //重置
    await this.avRecorder.reset();
    //释放录制实例
    await this.avRecorder.release();
    this.isRecording = false;
    this.stopTimer();
    this.stopWatch.stop();
    let currentTime: number = this.stopWatch.getTimeSeconds();
    this.ctx.rnInstance.emitDeviceEvent('recordingFinished', { currentTime });
    this.showToast('stop recording.');
  }

  //获取存储路径
  public getAllPath(): PathMap {
    const pathMap: PathMap = {
      FilesDirectoryPath: this.context.filesDir,
      CacheDirectoryPath: this.context.cacheDir,
      TempsDirectoryPath: this.context.tempDir,
    }
    Logger.info(`${TAG} return the pathMap.`);
    return pathMap;
  }

  private showToast(message: string) {
    return promptAction.showToast({ message, bottom: TIP_BOTTOM, duration: TOAST_DURATION });
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (this.avRecorder.state === AVRecorderStateEnum.STARTED) {
        let currentTime: number = this.stopWatch.getTimeSeconds();
        this.ctx.rnInstance.emitDeviceEvent('recordingProgress', { currentTime });
      }
    }, 1000)
  }

  private stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

















