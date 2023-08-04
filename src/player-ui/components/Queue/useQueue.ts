import { useMemo } from 'react';

import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useTabs } from '~player-ui/contexts/Tabs';
import { useMusicService } from '~player-ui/hooks/useMusicService';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';

export const useQueue = () => {
  const playbackState = usePlaybackState();
  const musicService = useMusicService();
  const { sendToTab } = useTabs();

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
    handlePlayQueueTrack,
    musicServiceName,
    queueItems: queue
  };
};