import { useMemo } from 'react';

import { usePlaybackState } from '~player-ui/contexts/PlaybackState';

export const useControllerScreen = () => {
  const playbackState = usePlaybackState();

  const queueCount = useMemo(
    () => playbackState?.queue?.length ?? 0,
    [playbackState]
  );

  return {
    queueCount
  };
};
