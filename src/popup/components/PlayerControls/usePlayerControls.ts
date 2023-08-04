import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { useExpanded } from '~popup/contexts/Expanded';
import { usePlaybackState } from '~popup/contexts/PlaybackState';
import { useTabs } from '~popup/contexts/Tabs';
import { ControllerMessageType } from '~types/ControllerMessageType';

export const usePlayerControls = () => {
  const { expanded } = useExpanded();
  const currentSongInfo = useCurrentSongInfo();
  const playbackState = usePlaybackState();
  const { sendToTab } = useTabs();

  const handleTogglePausePlay = () => {
    sendToTab({
      name: ControllerMessageType.PLAY_PAUSE
    });
  };

  const handleNext = () => {
    sendToTab({
      name: ControllerMessageType.NEXT
    });
  };

  const handlePrevious = () => {
    sendToTab({
      name: ControllerMessageType.PREVIOUS
    });
  };

  const handleSeek = (time: number) => {
    sendToTab({
      name: ControllerMessageType.SEEK_TO,
      body: {
        time
      }
    });
  };

  const handleToggleRepeat = () => {
    sendToTab({
      name: ControllerMessageType.TOGGLE_REPEAT_MODE
    });
  };

  const handleChangeVolume = (volume: number) => {
    sendToTab({
      name: ControllerMessageType.SET_VOLUME,
      body: {
        volume
      }
    });
  };

  const handleToggleMute = () => {
    sendToTab({
      name: ControllerMessageType.TOGGLE_MUTE
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
