import React, { createContext, useContext, useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '~constants/urls';

export interface TabsContextValue {
  selectedTab: chrome.tabs.Tab | null;
  sendToTab: (message: any) => Promise<any>;
  setSelectedTab: React.Dispatch<React.SetStateAction<number | null>>;
  allTabs: chrome.tabs.Tab[] | null;
  loading: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface SelectedTabsProviderProps {
  children: React.ReactNode;
  value: TabsContextValue;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const TabsProvider = ({
  children,
  value
}: SelectedTabsProviderProps) => {
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabs = () => useContext(TabsContext);
