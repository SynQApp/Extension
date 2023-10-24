import type { PlasmoMessaging } from '@plasmohq/messaging';

interface RedirectToTabBody {
  tabName: string;
  searchParams: Record<string, string>;
}

/**
 *
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { tabName, searchParams } = req.body as RedirectToTabBody;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab) {
    res.send(undefined);
  }

  chrome.tabs.update(tab.id!, {
    url: `tabs/${tabName}.html?${new URLSearchParams(searchParams).toString()}`
  });

  res.send(undefined);
};

export default handler;
