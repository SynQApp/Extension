import { useCurrentSongInfo } from '~player-ui/contexts/CurrentSongInfo';
import { useExpanded } from '~player-ui/contexts/Expanded';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useTabs } from '~player-ui/contexts/Tabs';
import { MusicControllerMessage } from '~types/MusicControllerMessage';

export const usePlayerControls = () => {
  const expanded = useExpanded();
  const currentSongInfo = useCurrentSongInfo();
  const playbackState = usePlaybackState();
  const { sendToTab } = useTabs();

  const handleTogglePausePlay = () => {
    sendToTab({
      name: MusicControllerMessage.PLAY_PAUSE
    });
  };

  const handleNext = () => {
    sendToTab({
      name: MusicControllerMessage.NEXT
    });
  };

  const handlePrevious = () => {
    sendToTab({
      name: MusicControllerMessage.PREVIOUS
    });
  };

  const handleSeek = (time: number) => {
    sendToTab({
      name: MusicControllerMessage.SEEK_TO,
      body: {
        time
      }
    });
  };

  const handleToggleRepeat = () => {
    sendToTab({
      name: MusicControllerMessage.TOGGLE_REPEAT_MODE
    });
  };

  const handleChangeVolume = (volume: number) => {
    sendToTab({
      name: MusicControllerMessage.SET_VOLUME,
      body: {
        volume
      }
    });
  };

  const handleToggleMute = () => {
    sendToTab({
      name: MusicControllerMessage.TOGGLE_MUTE
    });
  };

  return {
    currentSongInfo,
    expanded,
    playbackState,
    sendToTab,
    handleTogglePausePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleToggleRepeat,
    handleChangeVolume,
    handleToggleMute
  };
};
