import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const usePreviousButton = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const handleClick = () => {
    sendToContent(
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
