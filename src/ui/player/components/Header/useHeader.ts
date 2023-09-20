import { useMemo } from 'react';

import { usePlayerContext } from '~ui/player/contexts/PlayerContext';
import { getMusicServiceNameFromUrl } from '~util/musicService';

export const useHeader = () => {
  const { closePlayer } = usePlayerContext();

  const musicServiceName = useMemo(() => {
    return getMusicServiceNameFromUrl(window.location.href);
  }, []);

  return {
    closePlayer,
    musicServiceName
  };
};
