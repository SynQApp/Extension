import { store } from '~store';
import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<any> = async (message) => {
  store.dispatch(message);
};

export default handler;
