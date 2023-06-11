import type { PlasmoMessaging } from '@plasmohq/messaging';

/**
 * A handler to take a screenshot of the current tab if the sender is the current tab.
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const currentTabs = await chrome.tabs.query({
    active: true
  });

  if (!currentTabs.map((tab) => tab.id).includes(req.sender.tab?.id)) {
    // We can only screenshot the visible tab, so if the sender isn't the current tab,
    // we can't take a screenshot.
    res.send(undefined);
  }

  const screenshot = await chrome.tabs.captureVisibleTab();
  res.send(screenshot);
};

export default handler;
