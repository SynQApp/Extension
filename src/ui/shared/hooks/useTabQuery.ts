import { useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '../../../constants/urls';

export const useTabsQuery = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[] | null>(null);

  useEffect(() => {
    chrome.tabs.query({ url: ALL_URL_MATCHES }, (tabs) => {
      if (tabs?.length) {
        setTabs(tabs);
      }
    });
  }, []);

  return tabs;
};
