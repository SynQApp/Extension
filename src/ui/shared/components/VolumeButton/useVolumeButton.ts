import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';
import { sendMessage } from '~util/sendMessage';

export const useVolumeButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_MUTE
      },
      musicServiceTab?.tabId
    );
    sendAnalytic({
      name: 'toggle_mute'
    });
  };

  return {
    muted: playerState?.volume === 0,
    handleClick
  };
};
