import type { PlasmoCSConfig } from 'plasmo';

import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { YouTubeMusicLinkController } from '~services/youtube-music/YouTubeMusicLinkController';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { YouTubeMusicObserver } from '../services/youtube-music/YouTubeMusicObserver';
import { YouTubeMusicPlaybackController } from '../services/youtube-music/YouTubeMusicPlaybackController';
import { createRedirectHandler } from './lib/message-handlers/createRedirectHandler';
import { createNotificationObserverHandler } from './lib/observer-handlers/notificationObserverHandler';

export const config: PlasmoCSConfig = {
  matches: ['*://music.youtube.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing YouTube Music');

  const hub = connectToReduxHub(extensionId);

  const playbackController = new YouTubeMusicPlaybackController();
  const linkController = new YouTubeMusicLinkController();
  const observer = new YouTubeMusicObserver(playbackController, hub);

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
