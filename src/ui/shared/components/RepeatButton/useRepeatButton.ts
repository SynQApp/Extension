import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const useRepeatButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = useAppSelector((state) => state.playerState);

  const repeatMode = playerState?.repeatMode;

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_REPEAT_MODE
      },
      musicServiceTab?.tabId
    );
  };

  return {
    repeatMode,
    handleClick
  };
};
