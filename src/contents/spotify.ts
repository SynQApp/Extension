import type { PlasmoCSConfig } from 'plasmo';

import { createAutoplayReadyHandler } from '~lib/message-handlers/createAutoplayReadyHandler';
import { createMusicControllerHandler } from '~lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~lib/message-handlers/createObserverEmitterHandler';
import { SpotifyController } from '~lib/music-controllers/SpotifyController';
import { SpotifyObserverEmitter } from '~lib/observer-emitters/SpotifyObserverEmitter';
import { connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: ['*://open.spotify.com/*'],
  all_frames: true,
  world: 'MAIN'
};

const initialize = (extensionId: string) => {
  console.info('SynQ: Initializing Spotify');

  const hub = connectToReduxHub(extensionId);

  const controller = new SpotifyController();
  const observer = new SpotifyObserverEmitter(controller, hub);

  createMusicControllerHandler(controller);
  createObserverEmitterHandler(observer);
  createAutoplayReadyHandler(controller);

  observer.observe();
};

onDocumentReady(() => {
  window.addEventListener('SynQ:ExtensionId', (e) => {
    const extensionId = (e as CustomEvent).detail;
    initialize(extensionId);
  });

  window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
});
