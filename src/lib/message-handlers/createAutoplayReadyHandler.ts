import type { MusicController } from '~lib/music-controllers/MusicController';
import { AutoplayMessage } from '~types/AutoplayMessage';
import { NotReadyReason } from '~types/NotReadyReason';

export const createAutoplayReadyHandler = (controller: MusicController) => {
  window.addEventListener('SynQEvent:ToContent', async (event: CustomEvent) => {
    const message = event.detail.body;

    switch (message.name) {
      case AutoplayMessage.CHECK_AUTOPLAY_READY:
        const controllerReady = await controller.isReady();
        const autoPlayReady =
          controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

        if (!autoPlayReady) {
          const displayPopupEvent = new CustomEvent('SynQEvent:ToContent', {
            detail: {
              body: {
                name: AutoplayMessage.DISPLAY_AUTOPLAY_POPUP
              }
            }
          });

          window.dispatchEvent(displayPopupEvent);
        }

        const responseEvent = new CustomEvent(
          `SynQEvent:FromContent:${event.detail.requestId}`,
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
  });
};
