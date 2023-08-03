import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { usePlaybackState } from '~popup/contexts/PlaybackState';
import { useTabs } from '~popup/contexts/Tabs';
import { ControllerMessageType } from '~types/ControllerMessageType';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceFromUrl } from '~util/getMusicServiceFromUrl';

export const useQueue = () => {
  const playbackState = usePlaybackState();
  const currentSongInfo = useCurrentSongInfo();
  const theme = useTheme();
  const { sendToTab, selectedTab } = useTabs();

  const queue = useMemo(() => playbackState?.queue || [], [playbackState]);

  const musicServiceName = useMemo(() => {
    if (!selectedTab) {
      return '';
    }

    return getMusicServiceFromUrl(selectedTab?.url);
  }, [selectedTab]);

  const handlePlayQueueTrack = (trackId: string, trackIndex: number) => {
    const trackIndexes = findIndexes(queue, (item) => item.trackId === trackId);
    const duplicateIndex = trackIndexes.indexOf(trackIndex);

    sendToTab({
      name: ControllerMessageType.PLAY_QUEUE_TRACK,
      body: {
        trackId,
        duplicateIndex
      }
    });
  };

  return {
    currentTrackId: currentSongInfo?.trackId,
    handlePlayQueueTrack,
    musicServiceName,
    queueItems: queue,
    theme
  };
};
