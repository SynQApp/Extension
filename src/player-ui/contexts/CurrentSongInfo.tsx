import { createContext, useContext } from 'react';

import type { Track } from '~types';

const CurrentSongInfoContext = createContext<Track | null>(null);

interface CurrentSongInfoProviderProps {
  children: React.ReactNode;
  currentSongInfo: Track | null;
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
