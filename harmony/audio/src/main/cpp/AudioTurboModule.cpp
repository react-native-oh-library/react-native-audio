#include "AudioTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value __hostFunction_RTNAudioTurboModule_prepareRecordingAtPath(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "prepareRecordingAtPath", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_startRecording(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "startRecording", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_pauseRecording(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "pauseRecording", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_resumeRecording(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "resumeRecording", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_stopRecording(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "stopRecording", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_requestAuthorization(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestAuthorization", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_getAllPath(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getAllPath", args, count);
}

static jsi::Value __hostFunction_RTNAudioTurboModule_checkAuthorizationStatus(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkAuthorizationStatus", args, count);
}

RTNAudioTurboModule::RTNAudioTurboModule(const ArkTSTurboModule::Context ctx, const std::string name) : ArkTSTurboModule(ctx, name) {
  methodMap_["prepareRecordingAtPath"] = MethodMetadata{2, __hostFunction_RTNAudioTurboModule_prepareRecordingAtPath};
  methodMap_["startRecording"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_startRecording};
  methodMap_["pauseRecording"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_pauseRecording};
  methodMap_["resumeRecording"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_resumeRecording};
  methodMap_["stopRecording"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_stopRecording};
  methodMap_["requestAuthorization"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_requestAuthorization};
  methodMap_["getAllPath"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_getAllPath};
  methodMap_["checkAuthorizationStatus"] = MethodMetadata{0, __hostFunction_RTNAudioTurboModule_checkAuthorizationStatus};
}
