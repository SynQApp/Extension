import type { IObserverEmitter } from '~lib/observer-emitters/IObserverEmitter';
import { ContentEvent } from '~types/ContentEvent';
import { PopupMessageType } from '~types/PopupMessageType';

export const registerObserverEmitter = (observerEmitter: IObserverEmitter) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case PopupMessageType.POPUP_OPENED:
          await observerEmitter.resume();
          break;

        case PopupMessageType.POPUP_CLOSED:
          await observerEmitter.pause();
          break;
      }
    }
  );
};
