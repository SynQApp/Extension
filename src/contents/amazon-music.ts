import type { PlasmoCSConfig } from 'plasmo';

import { createAutoplayReadyHandler } from '~lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { AmazonMusicController } from '~lib/music-controllers/AmazonMusicController';
import { AmazonMusicObserverEmitter } from '~lib/observer-emitters/AmazonMusicObserverEmitter';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = () => {
  console.info('SynQ: Initializing Amazon Music');

  const controller = new AmazonMusicController();
  const observer = new AmazonMusicObserverEmitter(controller);

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);
  createAutoplayReadyHandler(controller);

  observer.observe();
};

onDocumentReady(initialize);
