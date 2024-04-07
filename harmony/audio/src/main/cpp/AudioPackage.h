#include "RNOH/Package.h"
#include "AudioTurboModule.h"

using namespace rnoh;
using namespace facebook;
class NativeRTNAudioFactoryDelegate : public TurboModuleFactoryDelegate {
  public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
      if (name == "RTNAudio") {
        return std::make_shared<RTNAudioTurboModule>(ctx, name);
      }
      return nullptr;
    }
};

namespace rnoh {
  class AudioPackage : public Package {
    public:
      AudioPackage(Package::Context ctx) : Package(ctx) {}
      std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
        return std::make_unique<NativeRTNAudioFactoryDelegate>();
      }
  };
} // namespace rnoh
