import { useEffect, useState } from 'react';

import type { PlaybackState } from '~player-ui/contexts/PlaybackState';
import { useTabs } from '~player-ui/contexts/Tabs';
import { EventMessageType } from '~types/Events';
import { MusicControllerMessage } from '~types/MusicControllerMessage';

export const usePlaybackState = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );
  const { selectedTab } = useTabs();

  useEffect(() => {
    if (!selectedTab) {
      setPlaybackState(null);
      return;
    }

    const getPlaybackState = async () => {
      let info = await chrome.tabs.sendMessage(selectedTab.id, {
        name: MusicControllerMessage.GET_PLAYER_STATE,
        body: {
          awaitResponse: true
        }
      });

      setPlaybackState(info);
    };

    getPlaybackState();

    const handleMessage = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ) => {
      if (
        message.name === EventMessageType.PLAYBACK_UPDATED &&
        sender.tab?.id === selectedTab.id
      ) {
        setPlaybackState(message.body.playbackState);
        sendResponse(undefined);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [selectedTab]);

  return playbackState;
};
