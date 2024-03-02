import { useEffect, useState } from 'react';

import { sendToBackground } from '~core/messaging';
import { useAppSelector } from '~store';
import type { MusicServiceTab } from '~types';

export const useDocumentMusicServiceTab = () => {
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);
  const [tabId, setTabId] = useState<number | undefined>(undefined);
  const [musicServiceTab, setMusicServiceTab] = useState<
    MusicServiceTab | undefined
  >(undefined);

  useEffect(() => {
    const updateTab = async () => {
      const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
        name: 'GET_SELF_TAB'
      });

      if (!tab) {
        return;
      }

      setTabId(tab.id);
    };

    updateTab();
  }, []);

  useEffect(() => {
    if (!tabId) {
      return;
    }

    const musicServiceTab = musicServiceTabs.find(
      (musicServiceTab) => musicServiceTab.tabId === tabId
    );

    if (!musicServiceTab) {
      return;
    }

    setMusicServiceTab(musicServiceTab);
  }, [musicServiceTabs, tabId]);

  return musicServiceTab;
};
