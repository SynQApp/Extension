import { store } from '~store';
import type { Track } from '~types';
import type { HubMessageHandler } from '~types/HubMessageHandler';
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
  return `${track.artistName} \u2022 ${track.albumName}`;
};

export const handler: HubMessageHandler<Track> = async (
  track,
  sender,
  sendResponse
) => {
  const state = store.getState();

  if (!state.settings.notificationsEnabled) {
    return;
  }

  if (isPopupOpen() || (await isCurrentTab(sender.tab.id))) {
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
    imageUrl = await imageUrlToDataUrl(track.albumCoverUrl);

    chrome.notifications.create({
      ...baseNotification,
      type: 'image',
      imageUrl
    });
  } catch (error) {
    console.error(error);
    chrome.notifications.create(baseNotification);
  }
};

export default handler;
