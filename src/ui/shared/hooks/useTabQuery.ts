import { useEffect, useState } from 'react';

import type { QueryTabsBody } from '~background/messages/QUERY_TABS';
import { sendToBackground } from '~core/messaging/sendToBackground';

import { ALL_URL_MATCHES } from '../../../constants/urls';

/**
 * Returns the music service tabs currently open in the browser.
 *
 * The query is delegated to the background service worker rather than calling
 * `chrome.tabs.query` here. This hook is reachable from the picture-in-picture
 * player, which renders the popup UI inside a content script, and `chrome.tabs`
 * does not exist in that context.
 */
export const useTabsQuery = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const queryTabs = async () => {
      try {
        const queriedTabs = await sendToBackground<
          QueryTabsBody,
          chrome.tabs.Tab[]
        >({
          name: 'QUERY_TABS',
          body: { urlMatches: ALL_URL_MATCHES }
        });

        if (!cancelled && queriedTabs?.length) {
          setTabs(queriedTabs);
        }
      } catch (error) {
        // Never let a failed tab lookup take down the surrounding UI. Callers
        // treat a null result as "unknown" and degrade gracefully.
        console.error('SynQ: Failed to query music service tabs', error);
      }
    };

    queryTabs();

    return () => {
      cancelled = true;
    };
  }, []);

  return tabs;
};
