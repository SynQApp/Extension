import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~lib/message-handlers/createTabsHandler';
import { AppleMusicController } from '~lib/music-controllers/AppleMusicController';
import { createNotificationObserverHandler } from '~lib/observer-handlers/notificationObserverHandler';
import { AppleMusicObserver } from '~lib/observers/AppleMusicObserver';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Apple Music');

  const hub = connectToReduxHub(extensionId);

  const controller = new AppleMusicController();
  const observer = new AppleMusicObserver(controller, hub);

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
