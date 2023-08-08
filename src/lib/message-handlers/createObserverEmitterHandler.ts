import type { ObserverEmitter } from '~lib/observer-emitters/IObserverEmitter';
import { ContentEvent, UiStateMessage } from '~types';

const UI_STATE = {
  popupOpen: false,
  sidebarOpen: false
};

export const createObserverEmitterHandler = (
  observerEmitter: ObserverEmitter
) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case UiStateMessage.POPUP_OPENED:
          UI_STATE.popupOpen = true;
          await observerEmitter.resume();
          break;

        case UiStateMessage.POPUP_CLOSED:
          UI_STATE.popupOpen = false;

          if (!UI_STATE.sidebarOpen) {
            await observerEmitter.pause();
          }

          break;

        case UiStateMessage.SIDEBAR_OPENED:
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
    }
  );
};
