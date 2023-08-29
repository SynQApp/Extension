import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import { useAppSelector } from '~store';
import { AutoplayMessage } from '~types';
import { sendMessage } from '~util/sendMessage';

const useControllerScreen = () => {
  const expanded = useExpanded();
  const navigate = useNavigate();
  const playerState = useAppSelector((state) => state.playerState);
  const autoplayReady = useAppSelector((state) => state.autoplayReady);
  const { musicServiceTab } = useMusicServiceTab();

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
    expanded,
    queueCount,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
