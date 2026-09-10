import type { PlasmoMessaging } from '@plasmohq/messaging';

export interface ReloadTabsBody {
  tabIds: number[];
}

/**
 * Reloads the given tabs. Lives in the background worker because `chrome.tabs`
 * is unavailable to content scripts. See QUERY_TABS for the full rationale.
 */
const handler: PlasmoMessaging.MessageHandler<ReloadTabsBody> = async (
  req,
  res
) => {
  const tabIds = req.body?.tabIds ?? [];

  await Promise.all(
    tabIds.map((tabId) =>
      // A tab can be closed between being listed and being reloaded; that is
      // not an error worth surfacing to the user.
      chrome.tabs.reload(tabId).catch(() => undefined)
    )
  );

  res.send(undefined);
};

export default handler;
