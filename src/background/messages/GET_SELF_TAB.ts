import type { PlasmoMessaging } from '@plasmohq/messaging';

export const handler: PlasmoMessaging.MessageHandler<undefined> = async (
  req,
  res
) => {
  res.send(req.sender?.tab?.id);
};

export default handler;
