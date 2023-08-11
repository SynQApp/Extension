import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { YouTubeMusicController } from '~lib/music-controllers/YouTubeMusicController';
import { YouTubeMusicObserverEmitter } from '~lib/observer-emitters/YouTubeMusicObserverEmitter';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing YouTube Music');

  const hub = connectToReduxHub(extensionId);

  const controller = new YouTubeMusicController();
  const observer = new YouTubeMusicObserverEmitter(controller, hub);

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);

  observer.observe();
};

onDocumentReady(() => {
  console.log('onDocumentReady');

  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    console.log('SynQ:ExtensionId', extensionId);
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
