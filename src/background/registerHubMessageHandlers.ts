import dispatchMessageHandler from './hubMessages/DISPATCH';
import screenshotMessageHandler from './hubMessages/SCREENSHOT';

export const registerHubMessageHandlers = (port: chrome.runtime.Port) => {
  port.onMessage.addListener(async (message) => {
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
    }
  });
};
