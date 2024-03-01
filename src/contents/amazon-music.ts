import type { PlasmoCSConfig } from 'plasmo';

import { createAutoplayReadyHandler } from '~contents/lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { AmazonMusicController } from '../services/amazon-music/AmazonMusicController';
import { AmazonMusicObserver } from '../services/amazon-music/AmazonMusicObserver';
import { createRedirectHandler } from './lib/message-handlers/createRedirectHandler';
import { createNotificationObserverHandler } from './lib/observer-handlers/notificationObserverHandler';

export const config: PlasmoCSConfig = {
  matches: ['*://music.amazon.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Amazon Music');

  const hub = connectToReduxHub(extensionId);

  const controller = new AmazonMusicController();
  const observer = new AmazonMusicObserver(controller, hub);

  createMusicControllerHandler(controller, hub);
  createObserverEmitterHandler(observer, hub);
  createAutoplayReadyHandler(controller, hub);
  createTabsHandler(controller, observer, hub);
  createRedirectHandler(controller, hub);

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
