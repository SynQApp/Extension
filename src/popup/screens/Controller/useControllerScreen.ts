import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicService } from '~player-ui/contexts/MusicService';
import { useTabs } from '~player-ui/contexts/Tabs';
import { useAppSelector } from '~store';
import { AutoplayMessage } from '~types';
import { sendMessage } from '~util/sendMessage';

const useControllerScreen = () => {
  const expanded = useExpanded();
  const { allTabs, loading: tabsLoading } = useTabs();
  const navigate = useNavigate();
  const playerState = useAppSelector((state) => state.playerState);
  const autoplayReady = useAppSelector((state) => state.autoplayReady);
  // const { sendMessage } = useMusicService();

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
    if (!autoplayReady) {
      navigate('/enable-autoplay');
    }
  }, [autoplayReady]);

  useEffect(() => {
    sendMessage({
      name: AutoplayMessage.CHECK_AUTOPLAY_READY,
      body: {
        awaitResponse: true
      }
    });
  }, []);

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
