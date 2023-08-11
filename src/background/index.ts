import { startHub } from '@plasmohq/messaging/pub-sub';

import { store } from '~store';

import { popupListener } from './popupListener';

popupListener();
startHub();

chrome.runtime.onConnectExternal.addListener((port) => {
  port.onMessage.addListener((message) => {
    if (message.name === 'DISPATCH') {
      store.dispatch(message.body);
    }
  });
});
