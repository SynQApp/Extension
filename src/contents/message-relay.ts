import type { PlasmoCSConfig } from 'plasmo';

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

/**
 * Content scripts running in an isolated world can't access the DOM of the page,
 * and scripts running in the page can't access the chrome APIs. This bridge allows
 *
 */
const initialize = () => {
  // Listen for messages from the background script and dispatch them to the page
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message from background script', message);
    const event = new CustomEvent('SynQEvent:Receive', {
      detail: { message }
    });

    window.dispatchEvent(event);
  });

  // Listen for messages from the page and dispatch them to the background script
  window.addEventListener('SynQEvent:Send', async (event: CustomEvent) => {
    let response = chrome.runtime.sendMessage(event.detail);

    if (response) {
      const responseEvent = new CustomEvent('SynQEvent:Response', {
        detail: response
      });

      window.dispatchEvent(responseEvent);
    }
  });
};

onDocumentReady(initialize);
