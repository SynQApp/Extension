import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const usePreviousButton = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.PREVIOUS
      },
      musicServiceTab?.tabId
    );
  };

  return {
    handleClick
  };
};
