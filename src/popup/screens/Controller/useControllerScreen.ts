import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMusicService } from '~player-ui/contexts/MusicService';
import { useTabs } from '~player-ui/contexts/Tabs';
import { useAppSelector } from '~store';
import { AutoplayMessage } from '~types';

const useControllerScreen = () => {
  const expanded = useAppSelector((state) => state.expanded);
  const { allTabs, loading: tabsLoading } = useTabs();
  const navigate = useNavigate();
  const playerState = useAppSelector((state) => state.playerState);
  const { sendMessage } = useMusicService();

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (tabsLoading) {
      return;
    }

    if (!allTabs || allTabs.length === 0) {
      navigate('/select-platform');
    } else if (allTabs.length > 1) {
      navigate('/select-tab');
    }
  }, [tabsLoading]);

  useEffect(() => {
    const checkAutoplayReady = async () => {
      const res = await sendMessage({
        name: AutoplayMessage.CHECK_AUTOPLAY_READY,
        body: {
          awaitResponse: true
        }
      });

      if (res?.ready === false) {
        navigate('/enable-autoplay');
      }
    };

    checkAutoplayReady();
  }, [sendMessage]);

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
