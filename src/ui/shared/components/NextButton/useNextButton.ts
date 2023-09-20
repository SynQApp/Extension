import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

export const useNextButton = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendMessage(
      {
        name: MusicControllerMessage.NEXT
      },
      musicServiceTab?.tabId
    );
  };

  return {
    handleClick
  };
};
