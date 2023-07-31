import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { useExpanded } from '~popup/contexts/Expanded';
import { usePlaybackState } from '~popup/contexts/PlaybackState';
import { useTabs } from '~popup/contexts/Tabs';

const useControllerScreen = () => {
  const { expanded, setExpanded } = useExpanded();
  const { allTabs, loading: tabsLoading } = useTabs();
  const currentSongInfo = useCurrentSongInfo();
  const navigate = useNavigate();
  const playbackState = usePlaybackState();

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (tabsLoading) {
      return;
    }

    if (!allTabs || allTabs.length === 0) {
      setExpanded(true);
      navigate('/select-platform');
    } else if (allTabs.length > 1) {
      navigate('/select-tab');
    }
  }, [tabsLoading]);

  const queueCount = useMemo(
    () => playbackState?.queue?.length ?? 0,
    [playbackState]
  );

  return {
    currentSongInfo,
    expanded,
    queueCount,
    setExpanded,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
