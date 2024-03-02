import type { PlasmoCSConfig } from 'plasmo';

import { YouTubeMusicAdapter } from '~adapters/youtube-music/YouTubeMusicAdapter';
import { registerAdapter } from '~core/adapter';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

registerAdapter(YouTubeMusicAdapter);
