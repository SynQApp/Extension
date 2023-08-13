import { store } from '~store';
import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<any> = async (
  message,
  sender,
  sendResponse
) => {
  sendResponse(sender.tab);
};

export default handler;
