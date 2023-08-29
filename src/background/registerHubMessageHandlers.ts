import dispatchMessageHandler from './hubMessages/DISPATCH';
import getSelfTabMessageHandler from './hubMessages/GET_SELF_TAB';
import screenshotMessageHandler from './hubMessages/SCREENSHOT';

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

      case 'SCREENSHOT':
        await screenshotMessageHandler(message.body, port.sender, sendResponse);
        break;

      case 'GET_SELF_TAB':
        await getSelfTabMessageHandler(message.body, port.sender, sendResponse);
        break;
    }
  });
};
