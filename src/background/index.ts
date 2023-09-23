import { startHub } from '@plasmohq/messaging/pub-sub';

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

chrome.runtime.onInstalled.addListener((installDetails) => {
  console.log('Installed or updated');

  store.dispatch(clearMusicServiceTabs());
});
