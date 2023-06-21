import { sendToBackground } from '@plasmohq/messaging';

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
    const event = new CustomEvent('SynQEvent:ToBackground', {
      detail: {
        requestId,
        message
      }
    });

    window.dispatchEvent(event);

    // Listen for the response from the background script
    window.addEventListener(
      `SynQEvent:FromBackground:${requestId}`,
      (event: CustomEvent) => {
        const { body } = event.detail;
        resolve(body as string);
      }
    );
  });
};
