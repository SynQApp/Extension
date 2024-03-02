import { createNotificationObserverHandler } from '~contents/lib/observer-handlers/notificationObserverHandler';
import {
  createAutoplayReadyHandler,
  createMusicControllerHandler,
  createRedirectHandler,
  createTabsHandler
} from '~core/message-handlers';
import { type ReduxHub, connectToReduxHub } from '~util/connectToReduxHub';
import { onDocumentReady } from '~util/onDocumentReady';

import type { MusicServiceAdapter } from './config';

declare global {
  interface Window {
    hub: ReduxHub;
  }
}

/**
 * Initialize the music service in the content script.
 *
 * @param controller
 * @returns
 */
export const registerAdapter = (service: MusicServiceAdapter) => {
  const initialize = (extensionId: string) => {
    console.info(`SynQ: Initializing ${service.displayName}`);

    const hub = connectToReduxHub(extensionId);
    window.hub = hub;

    const controller = service.contentController();
    const observer = service.observer(controller, hub);

    createMusicControllerHandler(controller, hub);
    createAutoplayReadyHandler(controller, hub);
    createTabsHandler(controller, observer, hub);
    createRedirectHandler(controller, hub);

    observer.observe();
  };

  onDocumentReady(() => {
    window.addEventListener('SynQ:ExtensionId', (e) => {
      const extensionId = (e as CustomEvent).detail;
      initialize(extensionId);
    });

    window.dispatchEvent(new CustomEvent('SynQ:GetExtensionId'));
  });
};
