import { useEffect, useState } from 'react';

import { sendToContent } from '~core/messaging/sendToContent';
import { useAppSelector } from '~store';
import type { MusicServiceTab } from '~types';
import { TabsMessage } from '~types/TabsMessage';

export const usePopupMusicServiceTab = () => {
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);
  const [musicServiceTab, setMusicServiceTab] = useState<
    MusicServiceTab | undefined
  >(undefined);
  const [manuallySelected, setManuallySelected] = useState(false);

  useEffect(() => {
    // If a music service tab is already selected, then just update it
    if (musicServiceTab) {
      setMusicServiceTab(
        musicServiceTabs?.find((tab) => tab.tabId === musicServiceTab?.tabId)
      );
    }

    // If the user has manually selected a music service tab, then don't override it
    if (manuallySelected) {
      return;
    }

    // If more than one music service tab is open, then don't auto select
    if (musicServiceTabs?.length > 1) {
      setMusicServiceTab(undefined);
    }

    // If there is only one music service tab open, then auto select it
    if (musicServiceTabs?.length === 1) {
      setMusicServiceTab(musicServiceTabs[0]);
    }
  }, [musicServiceTabs, manuallySelected]);

  useEffect(() => {
    if (!musicServiceTab) {
      return;
    }

    sendToContent({
      name: TabsMessage.SET_SELECTED_TAB,
      body: musicServiceTab.tabId
    });
  }, [musicServiceTab]);

  const _setMusicServiceTab = (tab: MusicServiceTab) => {
    setMusicServiceTab(tab);
    setManuallySelected(true);
  };

  return {
    musicServiceTab,
    setMusicServiceTab: _setMusicServiceTab
  };
};
