import React, { createContext, useContext } from 'react';

import type { MusicServiceTab } from '~types';

const MusicServiceTabContext = createContext<MusicServiceTab | null>(null);

interface MusicServiceTabProviderProps {
  children: React.ReactNode;
  value: MusicServiceTab;
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
