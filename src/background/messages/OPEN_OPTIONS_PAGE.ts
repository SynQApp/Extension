import type { PlasmoMessaging } from '@plasmohq/messaging';

import { store } from '~store';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
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
