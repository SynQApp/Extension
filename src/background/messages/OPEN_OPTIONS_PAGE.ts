import type { PlasmoMessaging } from '@plasmohq/messaging';

import { store } from '~store';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // Using chrome.runtime.openOptionsPage() would be ideal, but it doesn't
  // work when the popout is used to trigger the message because Chrome tries
  // to open the options page in the popout window, which is not allowed. Instead,
  // we try to open the options page in the same window as the music service tab.

  const state = store.getState();
  const musicServiceTabIds = state.musicServiceTabs.map((tab) => tab.tabId);

  const optionsUrl = chrome.runtime.getURL('options.html');
  const windows = await chrome.windows.getAll();

  const musicServiceTabWindow = windows.find((window) =>
    window.tabs?.some((tab) => musicServiceTabIds.includes(tab.id as number))
  );

  await chrome.tabs.create({
    url: optionsUrl,
    windowId: musicServiceTabWindow?.id
  });

  res.send(undefined);
};

export default handler;
