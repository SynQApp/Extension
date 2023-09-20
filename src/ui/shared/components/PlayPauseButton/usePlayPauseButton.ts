import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const usePlayPauseButton = () => {
  const playerState = useAppSelector((state) => state.playerState);
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.PLAY_PAUSE
      },
      musicServiceTab?.tabId
    );
  };

  return {
    isPlaying: playerState?.isPlaying,
    handleClick
  };
};
