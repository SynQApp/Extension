import type { MusicController } from '~lib/music-controllers/MusicController';
import { AutoplayMessage, ContentEvent, NotReadyReason } from '~types';

export const createAutoplayReadyHandler = (controller: MusicController) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case AutoplayMessage.CHECK_AUTOPLAY_READY:
          const controllerReady = await controller.isReady();
          const autoPlayReady =
            controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

          if (!autoPlayReady) {
            const displayPopupEvent = new CustomEvent(ContentEvent.TO_CONTENT, {
              detail: {
                body: {
                  name: AutoplayMessage.DISPLAY_AUTOPLAY_POPUP
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
