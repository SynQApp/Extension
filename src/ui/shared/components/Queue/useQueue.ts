import { useMemo } from 'react';
import type { DropResult } from 'react-beautiful-dnd';

import { useAppSelector } from '~store';
import {
  MusicControllerMessage,
  type QueueItem,
  SessionControllerMessage,
  type SessionQueueItem
} from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { findIndexes } from '~util/findIndexes';
import { getMusicServiceName } from '~util/musicService';
import { sendMessage } from '~util/sendMessage';

export const useQueue = (startAt: 'top' | 'next', count?: number) => {
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const playerState = useAppSelector((state) => state.playerState);
  const session = useAppSelector((state) => state.session);
  const { musicServiceTab } = useMusicServiceTab();

  const queue = useMemo(() => {
    let currentQueue = session ? session.queue : playerState?.queue;

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
  }, [playerState, count, currentTrack?.id, session, startAt]);

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

  const handleQueueItemReorder = (dropResult: DropResult) => {
    if (!musicServiceTab) {
      return;
    }

    const { source, destination } = dropResult;

    if (!source || !destination) {
      return;
    }

    const { index: sourceIndex } = source;
    const { index: destinationIndex } = destination;

    sendMessage(
      {
        name: SessionControllerMessage.UPDATE_SESSION_QUEUE_ITEM_POSITION,
        body: {
          sourceIndex,
          destinationIndex
        }
      },
      musicServiceTab.tabId
    );
  };

  return {
    handlePlayQueueTrack,
    handleQueueItemReorder,
    inSession: !!session,
    musicServiceName,
    queueItems: queue as SessionQueueItem[] | QueueItem[]
  };
};
