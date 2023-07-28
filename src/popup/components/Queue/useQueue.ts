import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { usePlaybackState } from '~popup/contexts/PlaybackState';
import { useTabs } from '~popup/contexts/Tabs';
import { ControllerMessageType } from '~types/ControllerMessageType';

interface UseQueueProps {
  start: 'beginning' | 'next';
  count?: number;
}

export const useQueue = ({ start, count }: UseQueueProps) => {
  const playbackState = usePlaybackState();
  const currentSongInfo = useCurrentSongInfo();
  const theme = useTheme();
  const { sendToTab } = useTabs();

  const queueItems = useMemo(() => {
    if (!playbackState) {
      return [];
    }

    if (start === 'beginning') {
      const endIndex = count || playbackState.queue.length;

      return playbackState.queue.slice(0, endIndex);
    }

    const currentSongIndex = playbackState.queue.findIndex(
      (song) => song.trackId === currentSongInfo?.trackId
    );

    const endIndex = count
      ? currentSongIndex + count + 1
      : playbackState.queue.length;

    return playbackState.queue.slice(currentSongIndex + 1, endIndex);
  }, [playbackState, start, count]);

  const handlePlayQueueTrack = (trackId: string) => {
    sendToTab({
      name: ControllerMessageType.PLAY_QUEUE_TRACK,
      body: {
        trackId
      }
    });
  };

  return {
    queueItems,
    handlePlayQueueTrack,
    theme
  };
};
