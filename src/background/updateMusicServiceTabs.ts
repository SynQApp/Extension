import { store } from '~store';
import {
  addMusicServiceTab,
  removeMusicServiceTab
} from '~store/slices/musicServiceTabs';
import { getMusicServiceFromUrl } from '~util/musicService';

export const updateMusicServiceTabs = (port: chrome.runtime.Port) => {
  if (!port.sender?.tab?.id) {
    return;
  }

  store.dispatch(
    addMusicServiceTab({
      tabId: port.sender.tab.id,
      musicService: getMusicServiceFromUrl(port.sender.tab.url)
    })
  );

  port.onDisconnect.addListener(() => {
    store.dispatch(removeMusicServiceTab(port.sender.tab.id));
  });
};
