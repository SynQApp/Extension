import { useEffect, useState } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import { useAppSelector } from '~store';
import type { MusicServiceTab } from '~types';
import { getMusicServiceFromUrl } from '~util/musicService';

export const useSidebarMusicServiceTab = () => {
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);
  const [tab, setTab] = useState<MusicServiceTab>(musicServiceTabs[0]);

  useEffect(() => {
    const updateTab = async () => {
      const tab = await sendToBackground({
        name: 'GET_SELF_TAB'
      });

      const musicService = getMusicServiceFromUrl(window.location.href);

      setTab({
        tabId: tab.id,
        musicService
      });
    };

    updateTab();
  }, []);

  return tab;
};
