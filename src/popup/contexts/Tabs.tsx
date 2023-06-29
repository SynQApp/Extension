import React, { createContext, useContext, useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '~constants/urls';

interface TabsContextValue {
  selectedTab: chrome.tabs.Tab | null;
  setSelectedTab: React.Dispatch<React.SetStateAction<number | null>>;
  allTabs: chrome.tabs.Tab[] | null;
  loading: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface SelectedTabsProviderProps {
  children: React.ReactNode;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const TabsProvider = ({ children }: SelectedTabsProviderProps) => {
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

  const value = {
    selectedTab,
    setSelectedTab,
    allTabs,
    loading
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabs = () => useContext(TabsContext);
