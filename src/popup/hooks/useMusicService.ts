import { useMemo } from 'react';

import type { MusicServiceContextValue } from '~player-ui/contexts/MusicService';
import { useTabs } from '~player-ui/contexts/Tabs';
import { getMusicServiceFromUrl } from '~util/musicService';

export const useMusicService = () => {
  const { selectedTab } = useTabs();

  const musicService = useMemo(
    () => (selectedTab?.url ? getMusicServiceFromUrl(selectedTab.url) : null),
    [selectedTab]
  );

  const sendMessage = async (message: any) => {
    if (!selectedTab) {
      return;
    }

    await chrome.tabs.sendMessage(selectedTab.id, message);
  };

  const musicServiceValue: MusicServiceContextValue = {
    sendMessage,
    musicService
  };

  return musicServiceValue;
};
