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

  const controller = new YouTubeMusicController(hub);
  const observer = new YouTubeMusicObserverEmitter(controller, hub);

  createMusicControllerHandler(controller, hub);
  createObserverEmitterHandler(observer, hub);

  observer.observe();

  setTimeout(async () => {
    await controller.prepareForSession();
  }, 5000);
};

onDocumentReady(() => {
  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
