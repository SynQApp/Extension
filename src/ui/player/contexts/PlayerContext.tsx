import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { UiStateMessage } from '~types';
import { sendMessage } from '~util/sendMessage';

interface PlayerContextValue {
  playerOpen: boolean;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  playerOpen: false,
  closePlayer: () => {}
});

interface PlayerProviderProps {
  children: React.ReactNode;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [playerOpen, setPlayerOpen] = useState(false);

  // For development purposes only
  useHotkeys(
    'ctrl+s',
    () => {
      setPlayerOpen(!playerOpen);
    },
    [playerOpen]
  );

  useEffect(() => {
    sendMessage({
      name: playerOpen
        ? UiStateMessage.SIDEBAR_OPENED
        : UiStateMessage.SIDEBAR_CLOSED
    });
  }, [playerOpen]);

  const closePlayer = () => {
    setPlayerOpen(false);
  };

  const value: PlayerContextValue = {
    playerOpen,
    closePlayer
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
