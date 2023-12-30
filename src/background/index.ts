import { getHubMap, startHub } from '@plasmohq/messaging/pub-sub';

import { createInstallHandler } from './createInstallHandler';
import { popupListener } from './popupListener';
import { registerHubMessageHandlers } from './registerHubMessageHandlers';
import { updateMusicServiceTabs } from './updateMusicServiceTabs';

popupListener();
startHub();
updateMusicServiceTabs();
createInstallHandler();

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
