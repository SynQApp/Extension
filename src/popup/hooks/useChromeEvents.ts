import { useEffect, useState } from 'react';

import { EventMessage, MusicControllerMessage } from '~types';

import { useTabs } from './useTabs';

export const useChromeMusicController = <T>(
  initialCommand: MusicControllerMessage,
  eventMessage: EventMessage
) => {
  const [state, setState] = useState<T | null>(null);
  const { selectedTab } = useTabs();

  useEffect(() => {
    if (!selectedTab) {
      setState(null);
      return;
    }

    const getInitialState = async () => {
      let info = await chrome.tabs.sendMessage(selectedTab.id, {
        name: initialCommand,
        body: {
          awaitResponse: true
        }
      });

      setState(info);
    };

    getInitialState();

    const handleMessage = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ) => {
      if (message.name === eventMessage && sender.tab?.id === selectedTab.id) {
        setState(message.body);
        sendResponse(undefined);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [selectedTab]);

  return state;
};
