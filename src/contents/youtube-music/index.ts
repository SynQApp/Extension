import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { createNotificationObserverHandler } from '../lib/observer-handlers/notificationObserverHandler';
import { YouTubeMusicController } from './YouTubeMusicController';
import { YouTubeMusicObserver } from './YouTubeMusicObserver';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing YouTube Music');

  const hub = connectToReduxHub(extensionId);

  const controller = new YouTubeMusicController();
  const observer = new YouTubeMusicObserver(controller, hub);

  createMusicControllerHandler(controller, hub);
  createObserverEmitterHandler(observer, hub);
  createTabsHandler(controller, observer, hub);

  observer.observe();
  observer.subscribe(createNotificationObserverHandler(hub));
};

onDocumentReady(() => {
  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});