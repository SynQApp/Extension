import type { IController } from '~lib/controllers/IController';
import { AutoplayMessageType } from '~types/AutoplayMessageType';
import { ContentEvent } from '~types/ContentEvent';
import { NotReadyReason } from '~types/NotReadyReason';

export const registerAutoplayReadyHandler = (controller: IController) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case AutoplayMessageType.CHECK_AUTOPLAY_READY:
          const controllerReady = await controller.isReady();
          const autoPlayReady =
            controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

          if (!autoPlayReady) {
            const displayPopupEvent = new CustomEvent(ContentEvent.TO_CONTENT, {
              detail: {
                body: {
                  name: AutoplayMessageType.DISPLAY_AUTOPLAY_POPUP
                }
              }
            });

            window.dispatchEvent(displayPopupEvent);
          }

          const responseEvent = new CustomEvent(
            `${ContentEvent.FROM_CONTENT}:${event.detail.requestId}`,
            {
              detail: {
                body: {
                  ready: autoPlayReady
                }
              }
            }
          );

          window.dispatchEvent(responseEvent);

          break;
      }
    }
  );
};
