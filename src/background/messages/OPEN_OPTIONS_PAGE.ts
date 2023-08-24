import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  chrome.runtime.openOptionsPage();
  res.send(undefined);
};

export default handler;
