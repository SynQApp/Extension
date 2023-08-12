import type { MusicController } from '~lib/music-controllers/MusicController';
import { MusicServiceObserver } from '~lib/observers/MusicServiceObserver';
import { updateMusicServiceTab } from '~store/slices/musicServiceTabs';
import type { MusicServiceTab } from '~types';
import { TabsMessage } from '~types/TabsMessage';
import type { ReduxHub } from '~util/connectToReduxHub';
import { getMusicServiceFromUrl } from '~util/musicService';

export const createTabsHandler = (
  controller: MusicController,
  observer: MusicServiceObserver,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case TabsMessage.UPDATE_TAB:
        await handleUpdateTab(controller, hub);
        break;

      case TabsMessage.SET_SELECTED_TAB:
        await handleSetSelectedTab(observer, hub, message);
        break;
    }
  });
};

const handleUpdateTab = async (
  controller: MusicController,
  hub: ReduxHub
): Promise<void> => {
  const track = await controller.getCurrentTrack();
  const tab = await hub.asyncPostMessage<chrome.tabs.Tab>({
    name: 'GET_SELF_TAB'
  });
  const musicService = getMusicServiceFromUrl(tab.url);

  const musicServiceTab: MusicServiceTab = {
    tabId: tab.id,
    musicService,
    preview: track
  };

  hub.dispatch(updateMusicServiceTab(musicServiceTab));
};

const handleSetSelectedTab = async (
  observer: MusicServiceObserver,
  hub: ReduxHub,
  message: any
): Promise<void> => {
  const tab = await hub.asyncPostMessage<chrome.tabs.Tab>({
    name: 'GET_SELF_TAB'
  });

  if (tab.id === message.body) {
    observer.resume();
  } else {
    observer.pause({ currentTrack: true, playerState: true });
  }
};
