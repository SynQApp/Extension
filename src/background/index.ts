import { getHubMap, startHub } from '@plasmohq/messaging/pub-sub';

import { persistor, store } from '~store';
import { clearMusicServiceTabs } from '~store/slices/musicServiceTabs';
import { setSettings } from '~store/slices/settings';

import { popupListener } from './popupListener';
import { registerHubMessageHandlers } from './registerHubMessageHandlers';
import { updateMusicServiceTabs } from './updateMusicServiceTabs';

popupListener();
startHub();
updateMusicServiceTabs();

chrome.runtime.onConnectExternal.addListener((port) => {
  registerHubMessageHandlers(port);

  updateMusicServiceTabs();

  port.onDisconnect.addListener(() => {
    updateMusicServiceTabs();
  });
});

chrome.runtime.onConnect.addListener((port) => {
  if (!port.sender?.tab?.id) {
    return;
  }

  getHubMap().set(port.sender?.tab?.id, port);

  registerHubMessageHandlers(port);

  updateMusicServiceTabs();

  port.onDisconnect.addListener(() => {
    if (!port.sender?.tab?.id) {
      return;
    }

    getHubMap().delete(port.sender.tab.id);
    updateMusicServiceTabs();
  });
});

chrome.runtime.onInstalled.addListener((installDetails) => {
  store.dispatch(clearMusicServiceTabs());
});
