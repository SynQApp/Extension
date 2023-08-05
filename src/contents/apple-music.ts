import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { AppleMusicController } from '~lib/music-controllers/AppleMusicController';
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

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);

  observer.observe();
};

onDocumentReady(initialize);
