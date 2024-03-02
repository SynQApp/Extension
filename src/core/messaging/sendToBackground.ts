import {
  type MessagesMetadata,
  type PlasmoMessaging,
  sendToBackground as plasmoSendToBackground
} from '@plasmohq/messaging';

import type { ReconnectingHub } from './hub';

declare let window: Window & {
  hub: ReconnectingHub;
};

/**
 * Send a message to the background service worker. Works both in MAIN and ISOLATED worlds.
 * @param request The message to send to the background service worker.
 * @returns The response from the background service worker.
 */
export const sendToBackground = async <RequestBody = any, ResponseBody = any>(
  request: PlasmoMessaging.Request<keyof MessagesMetadata | string, RequestBody>
) => {
  if (window.hub) {
    return (await window.hub.postMessage(request)) as ResponseBody;
  } else {
    return (await plasmoSendToBackground(
      request as PlasmoMessaging.Request<keyof MessagesMetadata, RequestBody>
    )) as ResponseBody;
  }
};
