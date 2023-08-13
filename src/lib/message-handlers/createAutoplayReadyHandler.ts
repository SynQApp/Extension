import type { MusicController } from '~lib/music-controllers/MusicController';
import { setAutoplayReady } from '~store/slices/autoplayReady';
import { AutoplayMessage, NotReadyReason } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

export const createAutoplayReadyHandler = (
  controller: MusicController,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case AutoplayMessage.CHECK_AUTOPLAY_READY:
        const controllerReady = await controller.isReady();
        const autoPlayReady =
          controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

        hub.dispatch(setAutoplayReady(autoPlayReady));

        break;
    }
  });
};
