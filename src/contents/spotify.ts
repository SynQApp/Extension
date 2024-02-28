import type { PlasmoCSConfig } from 'plasmo';

import { SPOTIFY_ENABLED } from '~constants/features';
import { createAutoplayReadyHandler } from '~contents/lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import { SpotifyController } from '../services/spotify/SpotifyController';
import { SpotifyObserver } from '../services/spotify/SpotifyObserver';
import { createNotificationObserverHandler } from './lib/observer-handlers/notificationObserverHandler';

export const config: PlasmoCSConfig = {
  // Placeholder while Spotify is disabled
  matches: ['*://*.synqapp.io/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Spotify');

  const hub = connectToReduxHub(extensionId);

  const controller = new SpotifyController();
  const observer = new SpotifyObserver(controller, hub);

  createMusicControllerHandler(controller, hub);
  createObserverEmitterHandler(observer, hub);
  createAutoplayReadyHandler(controller, hub);
  createTabsHandler(controller, observer, hub);

  observer.observe();
  observer.subscribe(createNotificationObserverHandler(hub));
};

onDocumentReady(() => {
  if (!SPOTIFY_ENABLED) {
    return;
  }

  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
