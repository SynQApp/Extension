import type { Action } from 'redux';

import { store } from '~store';
import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<Action> = async (message) => {
  store.dispatch(message);
};

export default handler;
