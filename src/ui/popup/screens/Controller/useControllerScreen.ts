import { useEffect, useState } from 'react';

import { sendToContent } from '~core/messaging/sendToContent';
import { AutoplayMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

const useControllerScreen = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    sendToContent(
      {
        name: AutoplayMessage.CHECK_AUTOPLAY_READY,
        body: {
          awaitResponse: true
        }
      },
      musicServiceTab?.tabId
    );
  }, [musicServiceTab?.tabId]);

  return {
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
