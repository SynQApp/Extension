import React, { createContext, useContext } from 'react';

import type { MusicService } from '~types';

export interface MusicServiceContextValue {
  musicService: MusicService;
  sendMessage: (message: any) => Promise<any>;
}

const MusicServiceContext = createContext<MusicServiceContextValue | null>(
  null
);

interface MusicServiceProviderProps {
  children: React.ReactNode;
  value: MusicServiceContextValue;
}

/**
 * Returns the selected tab ID and a function to set the selected tab ID.
 * Automatically selects the tab if there is only one. Otherwise, the tab
 * must be selected manually.
 */
export const MusicServiceProvider = ({
  children,
  value
}: MusicServiceProviderProps) => {
  return (
    <MusicServiceContext.Provider value={value}>
      {children}
    </MusicServiceContext.Provider>
  );
};

export const useMusicService = () => useContext(MusicServiceContext);
