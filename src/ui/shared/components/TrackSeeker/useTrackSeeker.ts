import { useMemo } from 'react';

import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const useTrackSeeker = () => {
  const playerState = useAppSelector((state) => state.playerState);
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const { musicServiceTab } = useMusicServiceTab();

  const percentage = useMemo(() => {
    if (!currentTrack?.duration || !playerState?.currentTime) {
      return 0;
    }

    return (playerState.currentTime / currentTrack.duration) * 100;
  }, [playerState?.currentTime, currentTrack?.duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value);

    sendMessage(
      {
        name: MusicControllerMessage.SEEK_TO,
        body: {
          time
        }
      },
      musicServiceTab?.tabId
    );
  };

  return {
    currentTime: playerState?.currentTime,
    duration: currentTrack?.duration,
    percentage,
    handleSeek
  };
};
