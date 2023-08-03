import type { PlasmoCSConfig } from 'plasmo';

import { SpotifyController } from '~lib/controllers/SpotifyController';
import { registerAutoplayReadyHandler } from '~lib/message-handlers/registerAutoplayReadyHandler';
import { registerControllerHandler } from '~lib/message-handlers/registerControllerHandler';
import { SpotifyObserverEmitter } from '~lib/observer-emitters/SpotifyObserverEmitter';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://open.spotify.com/*'],
  all_frames: true
};

const initialize = () => {
  console.info('SynQ: Initializing Spotify');

  const controller = new SpotifyController();
  const observer = new SpotifyObserverEmitter(controller);

  registerControllerHandler(controller);
  registerAutoplayReadyHandler(controller);

  observer.observe();
};

onDocumentReady(initialize);
