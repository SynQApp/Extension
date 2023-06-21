import type { PlasmoMessaging } from '@plasmohq/messaging';

/**
 * No-op. This file just defines the message for Plasmo. Background script
 * does not need to do anything when this message is received.
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  res.send(undefined);
};

export default handler;
