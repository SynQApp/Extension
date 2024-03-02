import { sendToBackground } from '~core/messaging';
import type { ReconnectingHub } from '~core/messaging/hub';
import { updateMusicServiceTabAutoPlayReady } from '~store/slices/musicServiceTabs';
import { AutoplayMessage, NotReadyReason } from '~types';
import { dispatchFromContent } from '~util/store';

import type { ContentController } from '../adapter/controller';

export const createAutoplayReadyHandler = (
  controller: ContentController,
  hub: ReconnectingHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case AutoplayMessage.CHECK_AUTOPLAY_READY: {
        const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
          name: 'GET_SELF_TAB'
        });

        const controllerReady = await controller.isReady();
        const autoPlayReady =
          controllerReady !== NotReadyReason.AUTOPLAY_NOT_READY;

        dispatchFromContent(
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
