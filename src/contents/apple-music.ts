import type { PlasmoCSConfig } from 'plasmo';

import { AppleAdapter } from '~adapters/apple-music/AppleAdapter';
import { registerAdapter } from '~core/adapter';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true,
  world: 'MAIN'
};

registerAdapter(AppleAdapter);
