import { startHub } from '@plasmohq/messaging/pub-sub';

import { popupListener } from './popupListener';
import { registerHubMessageHandlers } from './registerHubMessageHandlers';
import { updateMusicServiceTabs } from './updateMusicServiceTabs';

popupListener();
startHub();

chrome.runtime.onConnectExternal.addListener((port) => {
  registerHubMessageHandlers(port);
  updateMusicServiceTabs(port);
});
