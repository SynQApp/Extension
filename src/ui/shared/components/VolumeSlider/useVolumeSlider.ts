import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const useVolumeSlider = () => {
  // const playerState = useAppSelector((state) => state.playerState);
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);

    sendMessage(
      {
        name: MusicControllerMessage.SET_VOLUME,
        body: {
          volume
        }
      },
      musicServiceTab?.tabId
    );
  };

  return {
    volume: playerState?.volume,
    handleVolumeSliderChange
  };
};
