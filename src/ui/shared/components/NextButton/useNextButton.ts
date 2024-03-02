import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useNextButton = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendToContent(
      {
        name: MusicControllerMessage.NEXT
      },
      musicServiceTab?.tabId
    );
    sendAnalytic({
      name: 'next'
    });
  };

  return {
    handleClick
  };
};
