import { store } from '~store';
import type { Track } from '~types';
import { imageUrlToDataUrl } from '~util/imageUrlToDataUrl';

export const createTrackNotification = async (track: Track) => {
  const state = store.getState();

  if (!state.settings.notificationsEnabled) {
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

const ICON_PATH = 'assets/icon.png';

const createMessage = (track: Track) => {
  return `${track.artistName}${
    track.albumName && ` \u2022 ${track.albumName}`
  }`;
};
