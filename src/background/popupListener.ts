import { ALL_URL_MATCHES } from '~constants/urls';
import { PopupMessage } from '~types/PopupMessage';

export const popupListener = () => {
  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') {
      return;
    }

    const tabs = await chrome.tabs.query({ url: ALL_URL_MATCHES });

    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        name: PopupMessage.POPUP_OPENED
      });
    });

    port.onDisconnect.addListener(async () => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          name: PopupMessage.POPUP_CLOSED
        });
      });
    });
  });
};
