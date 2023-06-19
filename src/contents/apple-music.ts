import type { PlasmoCSConfig } from 'plasmo';

import { AppleMusicController } from '~lib/controllers/AppleMusicController';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { AppleMusicObserverEmitter } from '~lib/observer-emitters/AppleMusicObserverEmitter';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.info('SynQ: Initializing Apple Music');

  const controller = new AppleMusicController();
  const observer = new AppleMusicObserverEmitter(controller);

  registerControllerHandler(controller);
  observer.observe();
};

onDocumentReady(initialize);
