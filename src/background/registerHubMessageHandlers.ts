import type { PlasmoMessaging } from '@plasmohq/messaging';

import activateOrOpenTabMessageHandler from './messages/ACTIVATE_OR_OPEN_TAB';
import createTrackNotificationMessageHandler from './messages/CREATE_TRACK_NOTIFICATION';
import dispatchMessageHandler from './messages/DISPATCH';
import getSelfTabMessageHandler from './messages/GET_SELF_TAB';
import getSettingsMessageHandler from './messages/GET_SETTINGS';
import queryTabsMessageHandler from './messages/QUERY_TABS';
import reloadTabsMessageHandler from './messages/RELOAD_TABS';

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

      // Registered here as well as being a Plasmo message file so that a
      // MAIN-world caller routed through the hub does not hang forever on an
      // unhandled message name.
      case 'QUERY_TABS':
        await queryTabsMessageHandler(req, res);
        break;

      case 'RELOAD_TABS':
        await reloadTabsMessageHandler(req, res);
        break;

      case 'ACTIVATE_OR_OPEN_TAB':
        await activateOrOpenTabMessageHandler(req, res);
        break;
    }
  });
};
