import globToRegExp from 'glob-to-regexp';

import {
  createMusicControllerHandler,
  createRedirectHandler,
  createTabsHandler
} from '~core/message-handlers';
import { type ReconnectingHub, connectToHub } from '~core/messaging/hub';
import { onDocumentReady } from '~util/onDocumentReady';

import type { MusicServiceAdapter } from './config';

declare let window: Window & {
  hub: ReconnectingHub;
};

/**
 * Match the current URL to an adapter.
 * @param url
 * @param adapters
 * @returns {MusicServiceAdapter | undefined}
 */
export const matchAdapter = (url: string, adapters: MusicServiceAdapter[]) => {
  return adapters.find((adapter) =>
    adapter.urlMatches.some((match) => {
      const regex = globToRegExp(match);
      return regex.test(url);
    })
  );
};

/**
 * Initialize the music service in the content script.
 *
 * @param controller
 * @returns
 */
export const registerAdapter = (service: MusicServiceAdapter) => {
  const initialize = (extensionId: string) => {
    console.info(`SynQ: Initializing ${service.displayName}`);

    const hub = connectToHub(extensionId);
    window.hub = hub;

    const controller = service.contentController();
    const observer = service.contentObserver(controller);

    createMusicControllerHandler(controller, hub);
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
