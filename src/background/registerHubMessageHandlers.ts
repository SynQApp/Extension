import createTrackNotificationMessageHandler from './hubMessages/CREATE_TRACK_NOTIFICATION';
import dispatchMessageHandler from './hubMessages/DISPATCH';
import getSelfTabMessageHandler from './hubMessages/GET_SELF_TAB';
import getSettingsMessageHandler from './hubMessages/GET_SETTINGS';

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

    switch (message.name) {
      case 'DISPATCH':
        await dispatchMessageHandler(message.body, port.sender, sendResponse);
        break;

      case 'GET_SELF_TAB':
        await getSelfTabMessageHandler(message.body, port.sender, sendResponse);
        break;

      case 'CREATE_TRACK_NOTIFICATION':
        await createTrackNotificationMessageHandler(
          message.body,
          port.sender,
          sendResponse
        );
        break;

      case 'GET_SETTINGS':
        await getSettingsMessageHandler(message, port.sender, sendResponse);
        break;
    }
  });
};
