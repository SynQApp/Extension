import type { PlasmoMessaging } from '@plasmohq/messaging';
import { type PubSubMessage, broadcast } from '@plasmohq/messaging/pub-sub';

const handler: PlasmoMessaging.MessageHandler<PubSubMessage> = async (
  req,
  res
) => {
  console.log('BROADCAST', req.body);
  broadcast(req.body);
  res.send(undefined);
};

export default handler;
