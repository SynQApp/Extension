import { useEffect, useState } from 'react';

import { useAppSelector } from '~store';
import type { MusicServiceTab } from '~types';
import { TabsMessage } from '~types/TabsMessage';
import { sendMessage } from '~util/sendMessage';

export const usePopupMusicServiceTab = () => {
  const session = useAppSelector((state) => state.session);
  const musicServiceTabs = useAppSelector((state) => state.musicServiceTabs);
  const [musicServiceTab, setMusicServiceTab] = useState(musicServiceTabs?.[0]);
  const [manuallySelected, setManuallySelected] = useState(false);

  useEffect(() => {
    // If there is an active session, use that tab
    if (session?.tabId) {
      const tab = musicServiceTabs?.find((tab) => tab.tabId === session.tabId);

      if (tab) {
        setMusicServiceTab(tab);
        return;
      }
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
  }, [musicServiceTabs, manuallySelected, session]);

  useEffect(() => {
    if (!musicServiceTab) {
      return;
    }

    console.log('Setting selected tab', musicServiceTab.tabId);

    sendMessage({
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
