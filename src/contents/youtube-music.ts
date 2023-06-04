import type { PlasmoCSConfig } from 'plasmo';

import { YouTubeMusicController } from '~lib/controllers/YouTubeMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { YouTubeMusicPlayerState } from '~types/YouTubeMusicPlayerState';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.log('Registering YouTube Music controller');
  const controller = new YouTubeMusicController();
  registerControllerHandler(controller);
};

onDocumentReady(initialize);
