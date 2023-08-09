import { useCurrentSongInfo } from '~player-ui/contexts/CurrentSongInfo';
import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicService } from '~player-ui/contexts/MusicService';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { MusicControllerMessage } from '~types';

export const usePlayerControls = () => {
  const expanded = useExpanded();
  const currentSongInfo = useCurrentSongInfo();
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
    currentSongInfo,
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
