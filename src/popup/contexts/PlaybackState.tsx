import { createContext, useContext, useEffect, useState } from 'react';

import { EventMessageType } from '~types/Events';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import type { PlayerState } from '~types/PlayerState';

import { useTabs } from './Tabs';

type PlaybackState = Omit<PlayerState, 'songInfo'>;

const PlaybackStateContext = createContext<PlaybackState | null>(null);

interface PlaybackStateProviderProps {
  children: React.ReactNode;
}

/**
 * Get the playback state.
 */
export const PlaybackStateProvider = ({
  children
}: PlaybackStateProviderProps) => {
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

  return (
    <PlaybackStateContext.Provider value={playbackState}>
      {children}
    </PlaybackStateContext.Provider>
  );
};

export const usePlaybackState = () => useContext(PlaybackStateContext);
