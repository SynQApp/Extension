import { UiStateMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

import type { MusicServiceObserver } from '../../../services/MusicServiceObserver';

const UI_STATE = {
  popupOpen: false,
  sidebarOpen: false,
  pipOpen: false
};

const handleUiClosed = async (observerEmitter: MusicServiceObserver) => {
  if (!UI_STATE.popupOpen && !UI_STATE.sidebarOpen && !UI_STATE.pipOpen) {
    await observerEmitter.pause();
  }
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
        await handleUiClosed(observerEmitter);
        break;

      case UiStateMessage.SIDEBAR_OPENED:
        UI_STATE.sidebarOpen = true;
        await observerEmitter.resume();
        break;

      case UiStateMessage.SIDEBAR_CLOSED:
        UI_STATE.sidebarOpen = false;
        await handleUiClosed(observerEmitter);
        break;

      case UiStateMessage.PIP_OPENED:
        UI_STATE.pipOpen = true;
        await observerEmitter.resume();
        break;

      case UiStateMessage.PIP_CLOSED:
        UI_STATE.pipOpen = false;
        await handleUiClosed(observerEmitter);
        break;
    }
  });
};
