import type { IObserverEmitter } from '~lib/observer-emitters/IObserverEmitter';
import { ContentEvent } from '~types/ContentEvent';
import { PopupMessage } from '~types/PopupMessage';

export const createObserverEmitterHandler = (
  observerEmitter: IObserverEmitter
) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case PopupMessage.POPUP_OPENED:
          await observerEmitter.resume();
          break;

        case PopupMessage.POPUP_CLOSED:
          await observerEmitter.pause();
          break;
      }
    }
  );
};
