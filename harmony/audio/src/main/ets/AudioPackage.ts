import { RNPackage, TurboModulesFactory } from 'rnoh/ts';
import type { TurboModule, TurboModuleContext } from 'rnoh/ts';
import { AudioModule } from './AudioModule';

class AudioModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === 'RTNAudio') {
      return new AudioModule(this.ctx)
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === 'RTNAudio';
  }
}

export class AudioPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new AudioModulesFactory(ctx);
  }
}
