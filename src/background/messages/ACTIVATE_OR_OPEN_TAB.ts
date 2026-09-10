import type { PlasmoMessaging } from '@plasmohq/messaging';

export interface ActivateOrOpenTabBody {
  urlMatch: string;
  url: string;
}

/**
 * Focuses an existing tab for a music service, or opens the service if no such
 * tab exists. Lives in the background worker because `chrome.tabs` is
 * unavailable to content scripts. See QUERY_TABS for the full rationale.
 */
const handler: PlasmoMessaging.MessageHandler<ActivateOrOpenTabBody> = async (
  req,
  res
) => {
  const urlMatch = req.body?.urlMatch;
  const url = req.body?.url;

  if (!urlMatch || !url) {
    res.send(undefined);
    return;
  }

  const tabs = await chrome.tabs.query({ url: urlMatch });
  const existingTabId = tabs.find((tab) => tab.id !== undefined)?.id;

  if (existingTabId !== undefined) {
    await chrome.tabs.update(existingTabId, { active: true });
  } else {
    await chrome.tabs.create({ url });
  }

  res.send(undefined);
};

export default handler;
