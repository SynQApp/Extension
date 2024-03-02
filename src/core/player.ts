import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { PlaybackState, Track } from '~types';
import { dispatchFromContent } from '~util/store';

import { sendToBackground } from './messaging';

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
};
