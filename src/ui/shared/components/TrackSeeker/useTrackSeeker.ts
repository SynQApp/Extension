import { useMemo } from 'react';

import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useTrackSeeker = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playbackState;
  const currentTrack = musicServiceTab?.currentTrack;

  const percentage = useMemo(() => {
    if (!currentTrack?.duration || !playerState?.currentTime) {
      return 0;
    }

    return (playerState.currentTime / currentTrack.duration) * 100;
  }, [playerState?.currentTime, currentTrack?.duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value);

    sendToContent(
      {
        name: MusicControllerMessage.SEEK_TO,
        body: {
          time
        }
      },
      musicServiceTab?.tabId
    );

    sendAnalytic(
      {
        name: 'seek_to'
      },
      1000
    );
  };

  return {
    currentTime: playerState?.currentTime,
    duration: currentTrack?.duration,
    percentage,
    handleSeek
  };
};
