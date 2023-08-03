import { createContext, useContext, useEffect, useState } from 'react';

import { EventMessageType } from '~types/Events';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import type { SongInfo } from '~types/PlayerState';

import { useTabs } from './Tabs';

const CurrentSongInfoContext = createContext<SongInfo | null>(null);

interface CurrentSongInfoProviderProps {
  children: React.ReactNode;
}

/**
 * Get the current song info.
 */
export const CurrentSongInfoProvider = ({
  children
}: CurrentSongInfoProviderProps) => {
  const [currentSongInfo, setCurrentSongInfo] = useState<SongInfo | null>(null);
  const { selectedTab } = useTabs();

  useEffect(() => {
    if (!selectedTab) {
      setCurrentSongInfo(null);
      return;
    }

    const getSongInfo = async () => {
      let info = await chrome.tabs.sendMessage(selectedTab.id, {
        name: MusicControllerMessage.GET_CURRENT_SONG_INFO,
        body: {
          awaitResponse: true
        }
      });

      setCurrentSongInfo(info);
    };

    getSongInfo();

    const handleMessage = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ) => {
      if (
        message.name === EventMessageType.SONG_INFO_UPDATED &&
        sender.tab?.id === selectedTab.id
      ) {
        setCurrentSongInfo(message.body.songInfo);
        sendResponse(undefined);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [selectedTab]);

  return (
    <CurrentSongInfoContext.Provider value={currentSongInfo}>
      {children}
    </CurrentSongInfoContext.Provider>
  );
};

export const useCurrentSongInfo = () => useContext(CurrentSongInfoContext);
