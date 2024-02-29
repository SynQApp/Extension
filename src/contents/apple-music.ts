import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { AppleMusicLinkController } from '~services/apple-music/AppleMusicLinkController';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { AppleMusicPlaybackController } from '../services/apple-music/AppleMusicController';
import { AppleMusicObserver } from '../services/apple-music/AppleMusicObserver';
import { createRedirectHandler } from './lib/message-handlers/createRedirectHandler';
import { createNotificationObserverHandler } from './lib/observer-handlers/notificationObserverHandler';

export const config: PlasmoCSConfig = {
  matches: ['*://music.apple.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Apple Music');

  const hub = connectToReduxHub(extensionId);

  const playbackController = new AppleMusicPlaybackController();
  const linkController = new AppleMusicLinkController();
  const observer = new AppleMusicObserver(playbackController, hub);

  createMusicControllerHandler(playbackController, hub);
  createObserverEmitterHandler(observer, hub);
  createTabsHandler(playbackController, observer, hub);
  createRedirectHandler(linkController, hub);

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
