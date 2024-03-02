import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { ContentController, ContentObserver } from '~core/adapter';
import { sendToBackground } from '~core/messaging';
import type { ReconnectingHub } from '~core/messaging/hub';
import { updateMusicServiceTab } from '~store/slices/musicServiceTabs';
import { type MusicServiceTab } from '~types';
import { TabsMessage } from '~types/TabsMessage';
import { getMusicServiceFromUrl } from '~util/musicService';
import { dispatchFromContent } from '~util/store';

export const createTabsHandler = (
  controller: ContentController,
  observer: ContentObserver,
  hub: ReconnectingHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case TabsMessage.UPDATE_TAB:
        await handleUpdateTab(controller);
        break;
    }
  });
};

const handleUpdateTab = async (
  controller: ContentController
): Promise<void> => {
  const currentTrack = await controller.getCurrentTrack();
  const playerState = await controller.getPlayerState();
  const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
    name: 'GET_SELF_TAB'
  });

  if (!tab.url) {
    return;
  }

  const musicService = getMusicServiceFromUrl(tab.url);

  if (!musicService) {
    return;
  }

  const musicServiceTab: MusicServiceTab = {
    tabId: tab.id!,
    musicService,
    currentTrack,
    playbackState: playerState
  };

  dispatchFromContent(updateMusicServiceTab(musicServiceTab));
};
