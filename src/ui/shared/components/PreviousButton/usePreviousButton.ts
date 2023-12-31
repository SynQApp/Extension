import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';
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
    sendAnalytic({
      name: 'previous'
    });
  };

  return {
    handleClick
  };
};
