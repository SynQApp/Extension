import { store } from '~store';
import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<undefined> = async (
  message,
  sender,
  sendResponse
) => {
  const settings = store.getState().settings;
  sendResponse(settings);
};

export default handler;
