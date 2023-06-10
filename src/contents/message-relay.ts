import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

import { onDocumentReady } from '~util/onDocumentReady';

export const config: PlasmoCSConfig = {
  matches: [
    '*://music.apple.com/*',
    '*://*.spotify.com/*',
    '*://music.youtube.com/*',
    '*://music.amazon.com/*'
  ],
  all_frames: true
};

interface SendEventDetail {
  requestId: string;
  message: {
    name: never;
    body?: never;
  };
}

/**
 * Content scripts running in an isolated world can't access the DOM of the page,
 * and scripts running in the page can't access the chrome APIs. We need to be able
 * to send messages between the MAIN world and the chrome runtime, so we use events
 * on the window object that both the MAIN and ISOLATED worlds have access to in order
 * to relay messages.
 */
const initialize = () => {
  // Listen for messages from the background script and dispatch them to the page
  chrome.runtime.onMessage.addListener((message) => {
    const event = new CustomEvent('SynQEvent:Receive', {
      detail: { message }
    });

    window.dispatchEvent(event);
  });

  // Listen for messages from the page and dispatch them to the background script
  window.addEventListener(
    'SynQEvent:Send',
    async (event: CustomEvent<SendEventDetail>) => {
      const response = await sendToBackground(event.detail.message);

      if (response) {
        const responseEvent = new CustomEvent('SynQEvent:Response', {
          detail: {
            // Include the requestId so the content script can match the response to the request
            requestId: event.detail.requestId,
            body: response
          }
        });

        window.dispatchEvent(responseEvent);
      }
    }
  );
};

onDocumentReady(initialize);
