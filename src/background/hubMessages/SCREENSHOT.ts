import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<undefined> = async (
  req,
  sender,
  sendResponse
) => {
  const currentTabs = await chrome.tabs.query({
    active: true
  });

  if (!currentTabs.map((tab) => tab.id).includes(sender?.tab?.id)) {
    // We can only screenshot the visible tab, so if the sender isn't the current tab,
    // we can't take a screenshot.
    return undefined;
  }

  const screenshot = await chrome.tabs.captureVisibleTab();

  sendResponse(screenshot);
};

export default handler;
