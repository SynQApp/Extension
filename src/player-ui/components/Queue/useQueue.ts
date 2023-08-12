import { useMemo } from 'react';

import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';
import { sendMessage } from '~util/sendMessage';

export const useQueue = (startAt: 'top' | 'next', count?: number) => {
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const playerState = useAppSelector((state) => state.playerState);
  const { musicServiceTab } = useMusicServiceTab();

  const queue = useMemo(() => {
    if (!playerState?.queue) {
      return [];
    }

    let { queue } = playerState;

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
  }, [playerState]);

  const musicServiceName = useMemo(
    () =>
      musicServiceTab ? getMusicServiceName(musicServiceTab.musicService) : '',
    [musicServiceTab]
  );

  const handlePlayQueueTrack = (trackId: string, trackIndex: number) => {
    const trackIndexes = findIndexes(
      queue,
      (item) => item.songInfo.id === trackId
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

  return {
    handlePlayQueueTrack,
    musicServiceName,
    queueItems: queue
  };
};
