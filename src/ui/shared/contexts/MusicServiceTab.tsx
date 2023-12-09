import React, { createContext, useContext } from 'react';

import type { MusicServiceTab } from '~types';

interface MusicServiceTabContextValue {
  musicServiceTab?: MusicServiceTab;
  setMusicServiceTab: (tab: MusicServiceTab) => void;
}

const MusicServiceTabContext = createContext<MusicServiceTabContextValue>({
  setMusicServiceTab: () => {}
});

interface MusicServiceTabProviderProps {
  children: React.ReactNode;
  value: MusicServiceTabContextValue;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const MusicServiceTabProvider = ({
  children,
  value
}: MusicServiceTabProviderProps) => {
  return (
    <MusicServiceTabContext.Provider value={value}>
      {children}
    </MusicServiceTabContext.Provider>
  );
};

export const useMusicServiceTab = () => useContext(MusicServiceTabContext);
