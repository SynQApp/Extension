import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

import { ContentEvent } from '~types';
import { generateRequestId } from '~util/generateRequestId';
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
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const requestId = generateRequestId();
    const event = new CustomEvent(ContentEvent.TO_CONTENT, {
      detail: {
        requestId,
        body: message
      }
    });

    if (message.body?.awaitResponse) {
      window.addEventListener(
        `${ContentEvent.FROM_CONTENT}:${requestId}`,
        (event: CustomEvent) => {
          sendResponse(event.detail.body);
        }
      );
    }

    window.dispatchEvent(event);

    return message.body?.awaitResponse ?? false;
  });

  // Listen for messages from the page and dispatch them to the background script
  window.addEventListener(
    ContentEvent.TO_BACKGROUND,
    async (event: CustomEvent<SendEventDetail>) => {
      const response = await sendToBackground(event.detail.message);

      if (response) {
        const responseEvent = new CustomEvent(
          `${ContentEvent.FROM_BACKGROUND}:${event.detail.requestId}`,
          {
            detail: {
              body: response
            }
          }
        );

        window.dispatchEvent(responseEvent);
      }
    }
  );
};

// onDocumentReady(initialize);
