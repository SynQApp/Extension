import type { PlasmoMessaging } from '@plasmohq/messaging';

import createTrackNotificationMessageHandler from './messages/CREATE_TRACK_NOTIFICATION';
import dispatchMessageHandler from './messages/DISPATCH';
import getSelfTabMessageHandler from './messages/GET_SELF_TAB';
import getSettingsMessageHandler from './messages/GET_SETTINGS';

export const registerHubMessageHandlers = (port: chrome.runtime.Port) => {
  port.onMessage.addListener(async (message) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendResponse = (response: any) => {
      const responseMessage = {
        requestId: message.requestId,
        body: response
      };

      port.postMessage(responseMessage);
    };

    const req: PlasmoMessaging.Request = {
      body: message.body,
      name: message.name,
      sender: port.sender
    };

    const res: PlasmoMessaging.Response = {
      send: sendResponse
    };

    switch (message.name) {
      case 'DISPATCH':
        await dispatchMessageHandler(req, res);
        break;

      case 'GET_SELF_TAB':
        await getSelfTabMessageHandler(req, res);
        break;

      case 'CREATE_TRACK_NOTIFICATION':
        await createTrackNotificationMessageHandler(req, res);
        break;

      case 'GET_SETTINGS':
        await getSettingsMessageHandler(req, res);
        break;
    }
  });
};
