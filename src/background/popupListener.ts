import { broadcast } from '@plasmohq/messaging/pub-sub';

import { POPUP_PORT } from '~constants/port';
import { ALL_URL_MATCHES } from '~constants/urls';
import { UiStateMessage } from '~types';

export const popupListener = () => {
  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== POPUP_PORT) {
      return;
    }

    broadcast({
      payload: { name: UiStateMessage.POPUP_OPENED }
    });

    port.onDisconnect.addListener(async () => {
      broadcast({
        payload: { name: UiStateMessage.POPUP_CLOSED }
      });
    });
  });
};
