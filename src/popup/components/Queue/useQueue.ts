import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { usePlaybackState } from '~popup/contexts/PlaybackState';
import { useTabs } from '~popup/contexts/Tabs';
import { useMusicService } from '~popup/hooks/useMusicService';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';

export const useQueue = () => {
  const playbackState = usePlaybackState();
  const currentSongInfo = useCurrentSongInfo();
  const theme = useTheme();
  const musicService = useMusicService();
  const { sendToTab, selectedTab } = useTabs();

  const queue = useMemo(() => playbackState?.queue || [], [playbackState]);

  const musicServiceName = useMemo(
    () => getMusicServiceName(musicService),
    [musicService]
  );

  const handlePlayQueueTrack = (trackId: string, trackIndex: number) => {
    const trackIndexes = findIndexes(
      queue,
      (item) => item.songInfo.trackId === trackId
    );
    const duplicateIndex = trackIndexes.indexOf(trackIndex);

    sendToTab({
      name: MusicControllerMessage.PLAY_QUEUE_TRACK,
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
