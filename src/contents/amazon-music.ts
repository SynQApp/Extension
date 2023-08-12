import type { PlasmoCSConfig } from 'plasmo';

import { createAutoplayReadyHandler } from '~lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~lib/message-handlers/createTabsHandler';
import { AmazonMusicController } from '~lib/music-controllers/AmazonMusicController';
import { AmazonMusicObserver } from '~lib/observers/AmazonMusicObserver';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

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

  observer.observe();
};

onDocumentReady(() => {
  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
