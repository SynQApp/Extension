import type { PlasmoCSConfig } from 'plasmo';

import { createAutoplayReadyHandler } from '~lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { SpotifyController } from '~lib/music-controllers/SpotifyController';
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

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);
  createAutoplayReadyHandler(controller);

  observer.observe();
};

onDocumentReady(initialize);
