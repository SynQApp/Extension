import type { Action } from 'redux';

import type { PlasmoMessaging } from '@plasmohq/messaging';
import { connectToHub } from '@plasmohq/messaging/pub-sub';

import { generateRequestId } from './generateRequestId';

type Listener = (
  message: PlasmoMessaging.Request,
  from?: number,
  to?: number
) => void;

export interface ReduxHub {
  dispatch: (action: Action) => void;
  addListener: (listener: Listener) => void;
  postMessage: (message: PlasmoMessaging.Request) => void;
  asyncPostMessage: <T = unknown>(
    message: PlasmoMessaging.Request
  ) => Promise<T>;
  port: chrome.runtime.Port;
}

let hubPort: chrome.runtime.Port;
const listeners: Listener[] = [];

export const connectToReduxHub = (extensionId: string): ReduxHub => {
  if (!extensionId?.length) {
    throw new Error('Extension ID is required to connect to Redux Hub');
  }

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
    dispatch: (action) =>
      hubPort.postMessage({ name: 'DISPATCH', body: action }),
    addListener: (listener: Listener) => {
      listeners.push(listener);
      hubPort.onMessage.addListener((message) => {
        listener(message.payload, message.from, message.to);
      });
    },
    postMessage: (message) => {
      hubPort.postMessage(message);
    },
    asyncPostMessage: (message) => {
      return new Promise((resolve) => {
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
