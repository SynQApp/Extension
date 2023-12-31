import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';
import { sendMessage } from '~util/sendMessage';

export const useRepeatButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;

  const repeatMode = playerState?.repeatMode;

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_REPEAT_MODE
      },
      musicServiceTab?.tabId
    );
    sendAnalytic({
      name: 'toggle_repeat_mode'
    });
  };

  return {
    repeatMode,
    handleClick
  };
};
