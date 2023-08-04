import { useMemo } from 'react';

import { useMusicService } from '~player-ui/contexts/MusicService';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';

export const useQueue = () => {
  const playbackState = usePlaybackState();
  const { sendMessage, musicService } = useMusicService();

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

    sendMessage({
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
