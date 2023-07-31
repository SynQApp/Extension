import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentSongInfo } from '~popup/contexts/CurrentSongInfo';
import { useExpanded } from '~popup/contexts/Expanded';
import { useTabs } from '~popup/contexts/Tabs';

const useControllerScreen = () => {
  const { expanded, setExpanded } = useExpanded();
  const { allTabs, loading: tabsLoading } = useTabs();
  const currentSongInfo = useCurrentSongInfo();
  const navigate = useNavigate();

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

  return {
    currentSongInfo,
    expanded,
    setExpanded
  };
};

export default useControllerScreen;
