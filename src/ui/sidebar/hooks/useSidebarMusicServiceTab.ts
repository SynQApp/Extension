import { useEffect, useState } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import { useAppSelector } from '~store';
import type { MusicServiceTab } from '~types';

export const useSidebarMusicServiceTab = () => {
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);
  const [tab, setTab] = useState<MusicServiceTab>(musicServiceTabs[0]);

  useEffect(() => {
    const updateTab = async () => {
      const tab = await sendToBackground({
        name: 'GET_SELF_TAB'
      });

      const musicServiceTab = musicServiceTabs.find(
        (musicServiceTab) => musicServiceTab.tabId === tab.id
      );

      if (musicServiceTab) {
        setTab(musicServiceTab);
      }
    };

    updateTab();
  }, [musicServiceTabs]);

  return tab;
};
