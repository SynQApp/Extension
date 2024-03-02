import type { PlasmoMessaging } from '@plasmohq/messaging';

import { sendToBackground } from '~core/messaging';

/**
 * Sends a message to content scripts. If tabId is not provided, the message is
 * broadcast to all content scripts.
 * @param message The message to send to the content script.
 * @param tabId The tab ID to send the message to.
 */
export const sendToContent = (
  message: PlasmoMessaging.Request,
  tabId?: number
) => {
  sendToBackground({
    name: 'BROADCAST',
    body: {
      to: tabId,
      payload: message
    }
  });
};
