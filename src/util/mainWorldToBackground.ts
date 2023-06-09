interface BackgroundMessage {
  name: any;
  body?: any;
}

/**
 * A util function to for using the message relay to send a message to the background script from a MAIN world content script.
 */
export const mainWorldToBackground = (
  message: BackgroundMessage
): Promise<string> => {
  // Generate a unique ID for this request
  const requestId = Math.random().toString(36).substring(7);

  console.log('Sending message to background', message, requestId);

  return new Promise((resolve) => {
    // Send message to background script via the message relay script
    const event = new CustomEvent('SynQEvent:Send', {
      detail: {
        requestId,
        message
      }
    });

    window.dispatchEvent(event);

    // Listen for the response from the background script
    window.addEventListener('SynQEvent:Response', (event: CustomEvent) => {
      console.log('Received response from background', event.detail);
      const { body, requestId: resRequestId } = event.detail;

      if (requestId === resRequestId) {
        resolve(body as string);
      }
    });
  });
};
