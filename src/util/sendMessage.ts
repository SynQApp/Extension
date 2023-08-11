import { type PlasmoMessaging, sendToBackground } from '@plasmohq/messaging';

export const sendMessage = (
  message: PlasmoMessaging.Request,
  tabId?: number
) => {
  sendToBackground({
    name: 'BROADCAST',
    body: {
      to: tabId,
      payload: message
    }
  });
};
