import { useMemo } from 'react';

import { useMusicService } from '~player-ui/contexts/MusicService';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';

export const useQueue = (startAt: 'top' | 'next', count?: number) => {
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const playbackState = usePlaybackState();
  const { sendMessage, musicService } = useMusicService();

  const queue = useMemo(() => {
    if (!playbackState?.queue) {
      return [];
    }

    let { queue } = playbackState;

    if (startAt === 'top') {
      queue = queue.slice(0);
    } else {
      const currentTrackIndex = queue.findIndex(
        (item) => item.songInfo.id === currentTrack?.id
      );

      queue = queue.slice(currentTrackIndex);
    }

    if (count) {
      queue = queue.slice(0, count);
    }

    return queue;
  }, [playbackState]);

  const musicServiceName = useMemo(
    () => getMusicServiceName(musicService),
    [musicService]
  );

  const handlePlayQueueTrack = (trackId: string, trackIndex: number) => {
    const trackIndexes = findIndexes(
      queue,
      (item) => item.songInfo.id === trackId
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
