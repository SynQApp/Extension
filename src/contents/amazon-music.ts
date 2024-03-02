import type { PlasmoCSConfig } from 'plasmo';

import { AmazonAdapater } from '~adapters/amazon-music/AmazonAdapter';
import { registerAdapter } from '~core/adapter';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true,
  world: 'MAIN'
};

registerAdapter(AmazonAdapater);
