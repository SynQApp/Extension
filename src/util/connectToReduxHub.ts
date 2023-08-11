import { connectToHub } from '@plasmohq/messaging/pub-sub';

export interface ReduxHub {
  dispatch: (action: any) => void;
  port: chrome.runtime.Port;
}

export const connectToReduxHub = (extensionId: string): ReduxHub => {
  const hub = connectToHub(extensionId);

  return {
    dispatch: (action: any) =>
      hub.postMessage({ name: 'DISPATCH', body: action }),
    port: hub
  };
};
