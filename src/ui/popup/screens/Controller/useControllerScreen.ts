import { useEffect, useState } from 'react';

import { AutoplayMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

const useControllerScreen = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    sendMessage(
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
