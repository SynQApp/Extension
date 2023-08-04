import { useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '~constants/urls';
import type { TabsContextValue } from '~player-ui/contexts/Tabs';

export const useTabs = (): TabsContextValue => {
  const [selectedTab, _setSelectedTab] = useState<chrome.tabs.Tab | null>(null);
  const [allTabs, setAllTabs] = useState<chrome.tabs.Tab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ url: ALL_URL_MATCHES }, (tabs) => {
      setAllTabs(tabs);

      if (tabs.length === 1) {
        _setSelectedTab(tabs[0]);
      }

      setLoading(false);
    });
  }, []);

  const setSelectedTab = (tabId: number | null) => {
    if (tabId === null) {
      _setSelectedTab(null);
      return;
    }

    chrome.tabs.get(tabId, (tab) => {
      _setSelectedTab(tab);
    });
  };

  const sendToTab = (message: any) => {
    if (selectedTab === null) {
      return;
    }

    return chrome.tabs.sendMessage(selectedTab.id!, message);
  };

  const value: TabsContextValue = {
    selectedTab,
    sendToTab,
    setSelectedTab,
    allTabs,
    loading
  };

  return value;
};
