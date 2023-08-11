import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicService } from '~player-ui/contexts/MusicService';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useAppSelector } from '~store';
import { MusicControllerMessage } from '~types';

export const usePlayerControls = () => {
  const expanded = useExpanded();
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const playbackState = usePlaybackState();
  const { sendMessage } = useMusicService();

  const handleTogglePausePlay = () => {
    sendMessage({
      name: MusicControllerMessage.PLAY_PAUSE
    });
  };

  const handleNext = () => {
    sendMessage({
      name: MusicControllerMessage.NEXT
    });
  };

  const handlePrevious = () => {
    sendMessage({
      name: MusicControllerMessage.PREVIOUS
    });
  };

  const handleSeek = (time: number) => {
    sendMessage({
      name: MusicControllerMessage.SEEK_TO,
      body: {
        time
      }
    });
  };

  const handleToggleRepeat = () => {
    sendMessage({
      name: MusicControllerMessage.TOGGLE_REPEAT_MODE
    });
  };

  const handleChangeVolume = (volume: number) => {
    sendMessage({
      name: MusicControllerMessage.SET_VOLUME,
      body: {
        volume
      }
    });
  };

  const handleToggleMute = () => {
    sendMessage({
      name: MusicControllerMessage.TOGGLE_MUTE
    });
  };

  return {
    currentTrack,
    expanded,
    playbackState,
    handleTogglePausePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleToggleRepeat,
    handleChangeVolume,
    handleToggleMute
  };
};
