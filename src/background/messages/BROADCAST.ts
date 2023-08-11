import type { PlasmoMessaging } from '@plasmohq/messaging';
import { type PubSubMessage, broadcast } from '@plasmohq/messaging/pub-sub';

const handler: PlasmoMessaging.MessageHandler<PubSubMessage> = async (
  req,
  res
) => {
  broadcast(req.body);
  res.send(undefined);
};

export default handler;
