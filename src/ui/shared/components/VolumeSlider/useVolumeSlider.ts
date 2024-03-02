import { sendToContent } from '~core/messaging/sendToContent';
import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useVolumeSlider = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playbackState;

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);

    sendToContent(
      {
        name: MusicControllerMessage.SET_VOLUME,
        body: {
          volume
        }
      },
      musicServiceTab?.tabId
    );

    sendAnalytic(
      {
        name: 'set_volume'
      },
      1000
    );
  };

  return {
    volume: playerState?.volume,
    handleVolumeSliderChange
  };
};
