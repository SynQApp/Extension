import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~lib/message-handlers/createTabsHandler';
import { YouTubeMusicController } from '~lib/music-controllers/YouTubeMusicController';
import { YouTubeMusicObserver } from '~lib/observer-emitters/YouTubeMusicObserver';
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
  const observer = new YouTubeMusicObserver(controller, hub);

  createMusicControllerHandler(controller, hub);
  createObserverEmitterHandler(observer, hub);
  createTabsHandler(controller, observer, hub);

  observer.observe();
};

onDocumentReady(() => {
  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
