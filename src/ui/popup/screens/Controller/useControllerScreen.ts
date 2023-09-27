import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '~store';
import { AutoplayMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

const useControllerScreen = () => {
  const navigate = useNavigate();
  const autoplayReady = useAppSelector((state) => state.autoplayReady);
  const { musicServiceTab } = useMusicServiceTab();
  const playerState = musicServiceTab?.playerState;

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (!autoplayReady) {
      navigate('/enable-autoplay');
    }
  }, [autoplayReady, navigate]);

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

  const queueCount = useMemo(
    () => playerState?.queue?.length ?? 0,
    [playerState]
  );

  return {
    queueCount,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
