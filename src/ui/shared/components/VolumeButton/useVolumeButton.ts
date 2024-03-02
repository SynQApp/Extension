import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useVolumeButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playbackState;

  const handleClick = () => {
    sendToContent(
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
