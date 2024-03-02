import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const usePlayPauseButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playbackState;

  const handleClick = () => {
    sendToContent(
      {
        name: MusicControllerMessage.PLAY_PAUSE
      },
      musicServiceTab?.tabId
    );
    sendAnalytic({
      name: 'play_pause'
    });
  };

  return {
    isPlaying: playerState?.isPlaying,
    handleClick
  };
};
