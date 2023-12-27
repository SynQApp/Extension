import type { MusicService } from '@synq/music-service-clients';
import { getLink } from '@synq/music-service-clients';
import { useMemo } from 'react';

import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';
import { sendMessage } from '~util/sendMessage';

export const useQueue = (startAt: 'top' | 'next', count?: number) => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;
  const currentTrack = musicServiceTab?.currentTrack;

  const queue = useMemo(() => {
    let currentQueue = playerState?.queue;

    if (!currentQueue) {
      return [];
    }

    if (startAt === 'top') {
      currentQueue = currentQueue.slice(0);
    } else {
      const currentTrackIndex = currentQueue.findIndex(
        (item) => item.track?.id === currentTrack?.id
      );

      currentQueue = currentQueue.slice(currentTrackIndex);
    }

    if (count) {
      currentQueue = currentQueue.slice(0, count);
    }

    return currentQueue;
  }, [playerState, count, currentTrack?.id, startAt]);

  const musicServiceName = useMemo(
    () =>
      musicServiceTab ? getMusicServiceName(musicServiceTab.musicService) : '',
    [musicServiceTab]
  );

  const handlePlayQueueTrack = (trackId: string, trackIndex: number) => {
    const trackIndexes = findIndexes(
      queue,
      (item) => item.track?.id === trackId
    );
    const duplicateIndex = trackIndexes.indexOf(trackIndex);

    sendMessage(
      {
        name: MusicControllerMessage.PLAY_QUEUE_TRACK,
        body: {
          trackId,
          duplicateIndex
        }
      },
      musicServiceTab?.tabId
    );
  };

  const handleVisitTrackOnMusicService = (
    musicService?: MusicService,
    trackId?: string
  ) => {
    if (!musicService || !trackId) {
      return;
    }

    const link = getLink({
      musicService,
      type: 'TRACK',
      trackId: trackId
    });

    window.open(link, '_blank');
  };

  return {
    handlePlayQueueTrack,
    handleVisitTrackOnMusicService,
    musicService: musicServiceTab?.musicService,
    musicServiceName,
    queueItems: queue
  };
};
