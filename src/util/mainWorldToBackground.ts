import { sendToBackground } from '@plasmohq/messaging';

import { ContentEvent } from '~types';

import { generateRequestId } from './generateRequestId';

/**
 * A util function for using the message relay to send a message to the background script
 * from a MAIN world content script.
 */
export const mainWorldToBackground: typeof sendToBackground = (
  message
): Promise<any> => {
  const requestId = generateRequestId();

  return new Promise((resolve) => {
    // Send message to background script via the message relay script
    const event = new CustomEvent(ContentEvent.TO_BACKGROUND, {
      detail: {
        requestId,
        message
      }
    });

    window.dispatchEvent(event);

    const eventName = `${ContentEvent.FROM_BACKGROUND}:${requestId}`;

    const responseListener = (event: CustomEvent) => {
      window.removeEventListener(eventName, responseListener);

      const { body } = event.detail;
      resolve(body as string);
    };

    // Listen for the response from the background script
    window.addEventListener(eventName, (event: CustomEvent) => {
      const { body } = event.detail;
      resolve(body as string);
    });
  });
};
