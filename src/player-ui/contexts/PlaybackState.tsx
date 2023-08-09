import { createContext, useContext } from 'react';

import type { PlayerState } from '~types';

export type PlaybackState = Omit<PlayerState, 'songInfo'>;

const PlaybackStateContext = createContext<PlaybackState | null>(null);

interface PlaybackStateProviderProps {
  children: React.ReactNode;
  playbackState: PlaybackState;
}

/**
 * Get the playback state.
 */
export const PlaybackStateProvider = ({
  children,
  playbackState
}: PlaybackStateProviderProps) => {
  return (
    <PlaybackStateContext.Provider value={playbackState}>
      {children}
    </PlaybackStateContext.Provider>
  );
};

export const usePlaybackState = () => useContext(PlaybackStateContext);
