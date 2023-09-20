import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const useVolumeButton = () => {
  const playerState = useAppSelector((state) => state.playerState);
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_MUTE
      },
      musicServiceTab?.tabId
    );
  };

  return {
    muted: playerState?.volume === 0,
    handleClick
  };
};
