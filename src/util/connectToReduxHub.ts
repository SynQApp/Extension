import { connectToHub } from '@plasmohq/messaging/pub-sub';

import { generateRequestId } from './generateRequestId';

type Listener = (message: any, from?: number, to?: number) => void;

export interface ReduxHub {
  dispatch: (action: any) => void;
  addListener: (listener: Listener) => void;
  postMessage: (message: any) => void;
  asyncPostMessage: <T = any>(message: any) => Promise<T>;
  port: chrome.runtime.Port;
}

let hubPort: chrome.runtime.Port;
const listeners: Listener[] = [];

export const connectToReduxHub = (extensionId: string): ReduxHub => {
  // The background service worker continually disconnects,
  // and we need to reconnect whenever it does, which this recursive
  // function does.
  const connect = () => {
    hubPort = connectToHub(extensionId);

    listeners.forEach((listener) => {
      hubPort.onMessage.addListener((message) => {
        listener(message.payload, message.from, message.to);
      });
    });

    hubPort.onDisconnect.addListener(() => {
      connect();
    });
  };

  connect();

  return createReduxHub();
};

const createReduxHub = (): ReduxHub => {
  return {
    dispatch: (action: any) =>
      hubPort.postMessage({ name: 'DISPATCH', body: action }),
    addListener: (listener: Listener) => {
      listeners.push(listener);
      hubPort.onMessage.addListener((message) => {
        listener(message.payload, message.from, message.to);
      });
    },
    postMessage: (message: any) => {
      hubPort.postMessage(message);
    },
    asyncPostMessage: (message: any) => {
      return new Promise((resolve, reject) => {
        const requestId = generateRequestId();

        hubPort.onMessage.addListener((response) => {
          if (response.requestId === requestId) {
            resolve(response.body);
          }
        });

        hubPort.postMessage({ ...message, requestId });
      });
    },
    port: hubPort
  };
};
