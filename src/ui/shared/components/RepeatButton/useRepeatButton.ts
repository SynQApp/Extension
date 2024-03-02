import { sendToContent } from '~core/messaging/sendToContent';
import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useRepeatButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;

  const repeatMode = playerState?.repeatMode;

  const handleClick = () => {
    sendToContent(
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
