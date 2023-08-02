import type { PlasmoCSConfig } from 'plasmo';

import { AmazonMusicController } from '~lib/controllers/AmazonMusicController';
import { registerAutoplayReadyHandler } from '~lib/message-handlers/registerAutoplayReadyHandler';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { registerObserverEmitter } from '~lib/message-handlers/registerObserverEmitter';
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

  registerControllerHandler(controller);
  registerObserverEmitter(observer);
  registerAutoplayReadyHandler(controller);

  observer.observe();
};

onDocumentReady(initialize);
