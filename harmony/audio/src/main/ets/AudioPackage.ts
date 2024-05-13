import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { AudioModule } from './AudioModule';
import { TM } from "@rnoh/react-native-openharmony/generated/ts";

class AudioModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === TM.RTNAudio.NAME) {
      return new AudioModule(this.ctx)
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === TM.RTNAudio.NAME;
  }
}

export class AudioPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new AudioModulesFactory(ctx);
  }
}
