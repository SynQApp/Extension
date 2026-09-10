import type { PlasmoMessaging } from '@plasmohq/messaging';

export interface QueryTabsBody {
  urlMatches: string[];
}

/**
 * Queries the browser for tabs matching the given URL patterns.
 *
 * `chrome.tabs` is not exposed to content scripts, so UI that can be rendered
 * inside one must not call it directly. The picture-in-picture player embeds the
 * popup UI in a content script context, where a direct `chrome.tabs.query` call
 * throws `Cannot read properties of undefined (reading 'query')` and takes the
 * whole React tree down with it, leaving an empty PiP window.
 *
 * Routing the query through the background service worker keeps the same UI
 * working in the popup, the options page, and picture-in-picture alike.
 */
const handler: PlasmoMessaging.MessageHandler<
  QueryTabsBody,
  chrome.tabs.Tab[]
> = async (req, res) => {
  const urlMatches = req.body?.urlMatches;

  if (!urlMatches?.length) {
    res.send([]);
    return;
  }

  const tabs = await chrome.tabs.query({ url: urlMatches });
  res.send(tabs);
};

export default handler;
