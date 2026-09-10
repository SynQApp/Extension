import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getSettings } from '~store';

export const handler: PlasmoMessaging.MessageHandler<undefined> = async (
  req,
  res
) => {
  // Waits for rehydration. The MV3 service worker is restarted frequently, so
  // a synchronous read here can answer with default settings instead of the
  // user's saved ones.
  const settings = await getSettings();
  res.send(settings);
};

export default handler;
