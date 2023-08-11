import { startHub } from '@plasmohq/messaging/pub-sub';

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
