import type { PlasmoMessaging } from '@plasmohq/messaging';

import { createTrackNotification } from '~core/notifications';
import { store } from '~store';
import type { Track } from '~types';
import { sendEvent } from '~util/analytics';

const isPopupOpen = (): boolean => {
  return store.getState().popupOpen;
};

const isCurrentTab = async (tabId: number) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.map((tab) => tab.id).includes(tabId);
};

export const handler: PlasmoMessaging.MessageHandler<Track> = async (req) => {
  const track = req.body;
  const sender = req.sender;

  if (!track) {
    return;
  }

  await sendEvent({
    name: 'track_played'
  });

  const state = store.getState();

  if (!state.settings.notificationsEnabled) {
    return;
  }

  const tabId = sender?.tab?.id;

  if (isPopupOpen() || !tabId || (await isCurrentTab(tabId))) {
    return;
  }

  await createTrackNotification(track);
};

export default handler;
