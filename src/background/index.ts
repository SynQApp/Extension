import { broadcast, getHubMap, startHub } from '@plasmohq/messaging/pub-sub';

import { POPUP_PORT } from '~constants/port';
import { MusicControllerMessage } from '~types';

import { initializeInstallHandler } from './createInstallHandler';
import { registerHubMessageHandlers } from './registerHubMessageHandlers';
import { updateMusicServiceTabs } from './updateMusicServiceTabs';

startHub();
updateMusicServiceTabs();
initializeInstallHandler();

/**
 * Broadcast a control message to all music service content scripts. Used to tell
 * services that need their queue UI visible (e.g. Spotify) to open it while the
 * popup is open and close it again once the popup closes.
 */
const broadcastToContent = (name: MusicControllerMessage): void => {
  broadcast({ payload: { name } });
};

chrome.runtime.onConnectExternal.addListener((port) => {
  registerHubMessageHandlers(port);

  updateMusicServiceTabs();

  port.onDisconnect.addListener(() => {
    updateMusicServiceTabs();
  });
});

chrome.runtime.onConnect.addListener((port) => {
  // The popup opens a port on mount and it's torn down when the popup closes,
  // which is our signal to open the queue UI while the popup is visible and
  // close it again afterwards.
  if (port.name === POPUP_PORT) {
    broadcastToContent(MusicControllerMessage.OPEN_QUEUE);

    port.onDisconnect.addListener(() => {
      broadcastToContent(MusicControllerMessage.CLOSE_QUEUE);
    });

    return;
  }

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
