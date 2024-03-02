import type { PlasmoMessaging } from '@plasmohq/messaging';

import { store } from '~store';

export const handler: PlasmoMessaging.MessageHandler<undefined> = async (
  req,
  res
) => {
  const settings = store.getState().settings;
  res.send(settings);
};

export default handler;
