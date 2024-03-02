import type { PlasmoMessaging } from '@plasmohq/messaging';
import { connectToHub as plasmoConnectToHub } from '@plasmohq/messaging/pub-sub';

import { generateRequestId } from '../../util/generateRequestId';

type Listener = (
  message: PlasmoMessaging.Request,
  from?: number,
  to?: number
) => void;

/**
 * A reconnecting hub enabling MAIN world content scripts to communicate with the
 * background service worker.
 */
export interface ReconnectingHub {
  addListener: (listener: Listener) => void;
  postMessage: <T = unknown>(message: PlasmoMessaging.Request) => Promise<T>;
  port: chrome.runtime.Port;
}

let hubPort: chrome.runtime.Port;
const listeners: Listener[] = [];

export const connectToHub = (extensionId: string): ReconnectingHub => {
  if (!extensionId?.length) {
    throw new Error('Extension ID is required to connect to hub');
  }

  // The background service worker continually disconnects,
  // and we need to reconnect whenever it does, which this recursive
  // function does.
  const connect = () => {
    hubPort = plasmoConnectToHub(extensionId);

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

  return createReconnectingHub();
};

const createReconnectingHub = (): ReconnectingHub => {
  return {
    addListener: (listener: Listener) => {
      listeners.push(listener);
      hubPort.onMessage.addListener((message) => {
        listener(message.payload, message.from, message.to);
      });
    },
    postMessage: (message) => {
      return new Promise((resolve) => {
        const requestId = generateRequestId();

        const listener = (response: any): void => {
          if (response.requestId === requestId) {
            resolve(response.body);
            hubPort.onMessage.removeListener(listener);
          }

          setTimeout(() => {
            hubPort.onMessage.removeListener(listener);
          }, 1000);
        };

        hubPort.onMessage.addListener(listener);

        hubPort.postMessage({ ...message, requestId });
      });
    },
    port: hubPort
  };
};
