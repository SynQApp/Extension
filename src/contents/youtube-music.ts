import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { YouTubeMusicController } from '~lib/music-controllers/YouTubeMusicController';
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

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);

  observer.observe();
};

onDocumentReady(initialize);
