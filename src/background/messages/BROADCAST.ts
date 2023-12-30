import type { PlasmoMessaging } from '@plasmohq/messaging';
import {
  type PubSubMessage,
  broadcast,
  getHubMap
} from '@plasmohq/messaging/pub-sub';

const handler: PlasmoMessaging.MessageHandler<PubSubMessage> = async (
  req,
  res
) => {
  if (req.body?.to) {
    const hubMap = getHubMap();
    const port = hubMap.get(req.body.to);

    if (port) {
      port.postMessage(req.body);
    }
  } else if (req.body) {
    broadcast(req.body);
  }
  res.send(undefined);
};

export default handler;
