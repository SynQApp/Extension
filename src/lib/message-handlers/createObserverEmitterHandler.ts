import type { MusicServiceObserver } from '~lib/observers/MusicServiceObserver';
import { UiStateMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

const UI_STATE = {
  popupOpen: false,
  sidebarOpen: false
};

export const createObserverEmitterHandler = (
  observerEmitter: MusicServiceObserver,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case UiStateMessage.POPUP_OPENED:
        UI_STATE.popupOpen = true;
        await observerEmitter.resume();
        break;

      case UiStateMessage.POPUP_CLOSED:
        UI_STATE.popupOpen = false;

        console.log('sidebar open', UI_STATE.sidebarOpen);
        if (!UI_STATE.sidebarOpen) {
          await observerEmitter.pause();
        }

        break;

      case UiStateMessage.SIDEBAR_OPENED:
        console.log('sidebar opened');
        UI_STATE.sidebarOpen = true;
        await observerEmitter.resume();
        break;

      case UiStateMessage.SIDEBAR_CLOSED:
        UI_STATE.sidebarOpen = false;

        if (!UI_STATE.popupOpen) {
          await observerEmitter.pause();
        }

        break;
    }
  });
};
