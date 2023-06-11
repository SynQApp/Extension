import { generateRequestId } from './generateRequestId';

interface BackgroundMessage {
  name: any;
  body?: any;
}

/**
 * A util function for using the message relay to send a message to the background script
 * from a MAIN world content script.
 */
export const mainWorldToBackground = (
  message: BackgroundMessage
): Promise<string> => {
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
        const { body, requestId: resRequestId } = event.detail;

        resolve(body as string);
      }
    );
  });
};
