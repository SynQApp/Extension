import type { PlasmoMessaging } from '@plasmohq/messaging';

/**
 * A handler to perform a fetch from the background script.
 */
const handler: PlasmoMessaging.MessageHandler<undefined> = async (req, res) => {
  const tabId = req.sender.tab?.id;

  res.send(tabId);
};

export default handler;
