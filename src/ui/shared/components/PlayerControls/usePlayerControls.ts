import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';
import { useExpanded } from '~ui/shared/contexts/Expanded';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const usePlayerControls = () => {
  const expanded = useExpanded();
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const playerState = useAppSelector((state) => state.playerState);
  const { musicServiceTab } = useMusicServiceTab();

  const handleTogglePausePlay = () => {
    sendMessage(
      {
        name: MusicControllerMessage.PLAY_PAUSE
      },
      musicServiceTab?.tabId
    );
  };

  const handleNext = () => {
    sendMessage(
      {
        name: MusicControllerMessage.NEXT
      },
      musicServiceTab?.tabId
    );
  };

  const handlePrevious = () => {
    sendMessage(
      {
        name: MusicControllerMessage.PREVIOUS
      },
      musicServiceTab?.tabId
    );
  };

  const handleSeek = (time: number) => {
    sendMessage(
      {
        name: MusicControllerMessage.SEEK_TO,
        body: {
          time
        }
      },
      musicServiceTab?.tabId
    );
  };

  const handleToggleRepeat = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_REPEAT_MODE
      },
      musicServiceTab?.tabId
    );
  };

  const handleChangeVolume = (volume: number) => {
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

  const handleToggleMute = () => {
    sendMessage(
      {
        name: MusicControllerMessage.TOGGLE_MUTE
      },
      musicServiceTab?.tabId
    );
  };

  return {
    currentTrack,
    expanded,
    playerState,
    handleTogglePausePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleToggleRepeat,
    handleChangeVolume,
    handleToggleMute
  };
};
