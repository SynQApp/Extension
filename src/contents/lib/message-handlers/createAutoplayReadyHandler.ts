import { updateMusicServiceTabAutoPlayReady } from '~store/slices/musicServiceTabs';
import { AutoplayMessage, NotReadyReason } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

import type { MusicServicePlaybackController } from '../../../services/MusicServicePlaybackController';

export const createAutoplayReadyHandler = (
  controller: MusicServicePlaybackController,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case AutoplayMessage.CHECK_AUTOPLAY_READY: {
        const tab = await hub.asyncPostMessage<chrome.tabs.Tab>({
          name: 'GET_SELF_TAB'
        });

        const controllerReady = await controller.isReady();
        const autoPlayReady =
          controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

        hub.dispatch(
          updateMusicServiceTabAutoPlayReady({
            tabId: tab.id!,
            autoPlayReady
          })
        );

        break;
      }
    }
  });
};
