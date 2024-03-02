import type { PlasmoMessaging } from '@plasmohq/messaging';

import { store } from '~store';
import type { Track } from '~types';
import { sendEvent } from '~util/analytics';
import { imageUrlToDataUrl } from '~util/imageUrlToDataUrl';

const ICON_PATH = 'assets/icon.png';

const isPopupOpen = (): boolean => {
  return store.getState().popupOpen;
};

const isCurrentTab = async (tabId: number) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.map((tab) => tab.id).includes(tabId);
};

const createMessage = (track: Track) => {
  return `${track.artistName}${
    track.albumName && ` \u2022 ${track.albumName}`
  }`;
};

export const handler: PlasmoMessaging.MessageHandler<Track> = async (
  req,
  res
) => {
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

  const baseNotification: chrome.notifications.NotificationOptions<true> = {
    type: 'basic',
    iconUrl: ICON_PATH,
    title: track.name,
    message: createMessage(track)
  };

  let imageUrl = undefined;

  try {
    if (track.albumCoverUrl) {
      imageUrl = await imageUrlToDataUrl(track.albumCoverUrl);

      chrome.notifications.create({
        ...baseNotification,
        type: 'basic',
        iconUrl: imageUrl
      });
    } else {
      chrome.notifications.create(baseNotification);
    }
  } catch (error) {
    console.error(error);
    chrome.notifications.create(baseNotification);
  }
};

export default handler;
