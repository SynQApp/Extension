import { POPUP_PORT } from '~constants/port';
import { ALL_URL_MATCHES } from '~constants/urls';
import { PopupMessageType } from '~types/PopupMessageType';

export const popupListener = () => {
  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== POPUP_PORT) {
      return;
    }

    const tabs = await chrome.tabs.query({ url: ALL_URL_MATCHES });

    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        name: PopupMessageType.POPUP_OPENED
      });
    });

    port.onDisconnect.addListener(async () => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          name: PopupMessageType.POPUP_CLOSED
        });
      });
    });
  });
};
