import type { PlasmoMessaging } from '@plasmohq/messaging';

import { type Event, sendEvent } from '~util/analytics';

/**
 * No-op. This file just defines the message for Plasmo. Background script
 * does not need to do anything when this message is received.
 */
const handler: PlasmoMessaging.MessageHandler<Event> = async (req, res) => {
  if (req.body) {
    await sendEvent(req.body);
  }

  res.send(undefined);
};

export default handler;
