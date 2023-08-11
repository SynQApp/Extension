import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler<undefined> = async (req, res) => {
  const tab = req.sender.tab;
  res.send(tab);
};

export default handler;
