import type { HubMessageHandler } from '~types/HubMessageHandler';

export const handler: HubMessageHandler<undefined> = async (
  message,
  sender,
  sendResponse
) => {
  sendResponse(sender.tab);
};

export default handler;
