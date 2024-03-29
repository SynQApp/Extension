import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { PlaybackState, Track } from '~types';
import { dispatchFromContent } from '~util/store';

import { sendToBackground } from './messaging';

let CURRENT_TRACK_ID: string | null = null;

/**
 * Update the playback state of the music service tab. This should only be called from ContentObservers.
 * @param playbackState The new playback state
 * @returns {Promise<void>}
 */
export const updatePlaybackState = async (
  playbackState: PlaybackState | null
): Promise<void> => {
  const tab = await sendToBackground<chrome.tabs.Tab>({
    name: 'GET_SELF_TAB'
  });

  if (!tab.id) {
    return;
  }

  dispatchFromContent(
    updateMusicServiceTabPlayerState({
      tabId: tab.id!,
      playbackState
    })
  );
};

let PREVENT_TRACK_NOTIFICATION = false;

/**
 * Update the current track of the music service tab. This should only be called from ContentObservers.
 * @param currentTrack The new current track
 * @returns {Promise<void>}
 */
export const updateCurrentTrack = async (
  currentTrack: Track | null
): Promise<void> => {
  const tab = await sendToBackground<chrome.tabs.Tab>({
    name: 'GET_SELF_TAB'
  });

  if (!tab.id) {
    return;
  }

  dispatchFromContent(
    updateMusicServiceTabCurrentTrack({
      tabId: tab.id!,
      currentTrack
    })
  );

  if (
    !currentTrack?.id ||
    PREVENT_TRACK_NOTIFICATION ||
    CURRENT_TRACK_ID === currentTrack?.id
  ) {
    return;
  }

  PREVENT_TRACK_NOTIFICATION = true;

  setTimeout(() => {
    PREVENT_TRACK_NOTIFICATION = false;
  }, 2000);

  await sendToBackground({
    name: 'CREATE_TRACK_NOTIFICATION',
    body: currentTrack
  });

  CURRENT_TRACK_ID = currentTrack?.id || null;
};
