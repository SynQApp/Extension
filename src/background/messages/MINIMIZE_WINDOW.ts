import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler<undefined> = async (req, res) => {
  const windowId = req.sender?.tab?.windowId;

  if (windowId) {
    chrome.windows.update(windowId, { state: 'minimized' });
  }

  res.send(undefined);
};

export default handler;
