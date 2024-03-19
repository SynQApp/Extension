import adapters from '~adapters';
import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage, type MusicService } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useRepeatButton = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playbackState;

  const repeatMode = playerState?.repeatMode;

  const repeatDisabled = adapters
    .find((adapter) => adapter.id === musicServiceTab?.musicService)
    ?.disabledFeatures?.includes('repeat');

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
    repeatDisabled,
    repeatMode,
    handleClick
  };
};
