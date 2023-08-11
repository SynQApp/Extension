import { connectToHub } from '@plasmohq/messaging/pub-sub';

import { generateRequestId } from './generateRequestId';

export interface ReduxHub {
  dispatch: (action: any) => void;
  addListener: (
    listener: (message: any, from?: number, to?: number) => void
  ) => void;
  postMessage: (message: any) => void;
  asyncPostMessage: (message: any) => Promise<any>;
  port: chrome.runtime.Port;
}

export const connectToReduxHub = (extensionId: string): ReduxHub => {
  const hub = connectToHub(extensionId);

  return {
    dispatch: (action: any) =>
      hub.postMessage({ name: 'DISPATCH', body: action }),
    addListener: (
      listener: (message: any, from?: number, to?: number) => void
    ) => {
      hub.onMessage.addListener((message) => {
        listener(message.payload, message.from, message.to);
      });
    },
    postMessage: (message: any) => {
      hub.postMessage(message);
    },
    asyncPostMessage: (message: any) => {
      return new Promise((resolve, reject) => {
        const requestId = generateRequestId();

        hub.onMessage.addListener((response) => {
          if (response.requestId === requestId) {
            resolve(response.body);
          }
        });

        hub.postMessage({ ...message, requestId });
      });
    },
    port: hub
  };
};
