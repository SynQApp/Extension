import type { PlasmoCSConfig } from 'plasmo';

import { YouTubeMusicController } from '~lib/controllers/YouTubeMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { YouTubeMusicObserverEmitter } from '~lib/observer-emitters/YouTubeMusicObserverEmitter';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.info('SynQ: Initializing YouTube Music');

  const controller = new YouTubeMusicController();
  const observer = new YouTubeMusicObserverEmitter(controller);

  registerControllerHandler(controller);
  observer.observe();
};

onDocumentReady(initialize);
