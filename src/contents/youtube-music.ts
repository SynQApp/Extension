import type { PlasmoCSConfig } from 'plasmo';

import { YouTubeMusicController } from '~lib/controllers/YouTubeMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.log('SynQ: Initializing YouTube Music');

  const controller = new YouTubeMusicController();
  registerControllerHandler(controller);
};

onDocumentReady(initialize);
