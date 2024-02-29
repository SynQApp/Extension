import type { PlasmoCSConfig } from 'plasmo';

import { SPOTIFY_ENABLED } from '~constants/features';
import { createAutoplayReadyHandler } from '~contents/lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { SpotifyLinkController } from '~services/spotify/SpotifyLinkController';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { SpotifyController } from '../services/spotify/SpotifyController';
import { SpotifyObserver } from '../services/spotify/SpotifyObserver';
import { createRedirectHandler } from './lib/message-handlers/createRedirectHandler';
import { createNotificationObserverHandler } from './lib/observer-handlers/notificationObserverHandler';

export const config: PlasmoCSConfig = {
  matches: ['*://open.spotify.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Spotify');

  const hub = connectToReduxHub(extensionId);

  const playbackController = new SpotifyController();
  const linkController = new SpotifyLinkController();
  const observer = new SpotifyObserver(playbackController, hub);

  createMusicControllerHandler(playbackController, hub);
  createObserverEmitterHandler(observer, hub);
  createAutoplayReadyHandler(playbackController, hub);
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
