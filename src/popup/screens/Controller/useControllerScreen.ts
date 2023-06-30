import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTabs } from '~popup/contexts/Tabs';

const useControllerScreen = () => {
  const { allTabs, loading: tabsLoading } = useTabs();
  const navigate = useNavigate();

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

  return;
};

export default useControllerScreen;
