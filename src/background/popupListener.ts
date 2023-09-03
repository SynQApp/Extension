import { broadcast } from '@plasmohq/messaging/pub-sub';

import { POPUP_PORT } from '~constants/port';
import { store } from '~store';
import { setPopupOpen } from '~store/slices/popupOpen';
import { UiStateMessage } from '~types';

export const popupListener = () => {
  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== POPUP_PORT) {
      return;
    }

    broadcast({
      payload: { name: UiStateMessage.POPUP_OPENED }
    });

    store.dispatch(setPopupOpen(true));

    port.onDisconnect.addListener(async () => {
      broadcast({
        payload: { name: UiStateMessage.POPUP_CLOSED }
      });

      store.dispatch(setPopupOpen(false));
    });
  });
};
