import { useMemo } from 'react';

import { useTabs } from '~popup/contexts/Tabs';
import { getMusicServiceFromUrl } from '~util/musicService';

export const useMusicService = () => {
  const { selectedTab } = useTabs();

  const musicService = useMemo(
    () => (selectedTab?.url ? getMusicServiceFromUrl(selectedTab.url) : null),
    [selectedTab]
  );

  return musicService;
};
