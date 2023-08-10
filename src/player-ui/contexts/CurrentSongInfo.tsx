import { createContext, useContext } from 'react';

import type { SongInfo } from '~types';

const CurrentSongInfoContext = createContext<SongInfo | null>(null);

interface CurrentSongInfoProviderProps {
  children: React.ReactNode;
  currentSongInfo: SongInfo | null;
}

/**
 * Get the current song info.
 */
export const CurrentSongInfoProvider = ({
  children,
  currentSongInfo
}: CurrentSongInfoProviderProps) => {
  return (
    <CurrentSongInfoContext.Provider value={currentSongInfo}>
      {children}
    </CurrentSongInfoContext.Provider>
  );
};

export const useCurrentSongInfo = () => useContext(CurrentSongInfoContext);
