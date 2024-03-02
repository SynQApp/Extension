import type { Action } from 'redux';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import { store } from '~store';

const handler: PlasmoMessaging.MessageHandler<Action> = async (req, res) => {
  const action = req.body;

  if (!action) {
    return;
  }

  store.dispatch(action);
};

export default handler;
