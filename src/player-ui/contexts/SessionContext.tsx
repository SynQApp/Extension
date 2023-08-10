import { createContext, useContext } from 'react';

import type { SessionDetails } from '~types';

const SessionDetailsContext = createContext<SessionDetails | null>(null);

interface SessionDetailsProviderProps {
  children: React.ReactNode;
  sessionDetails: SessionDetails | null;
}

/**
 * Get the current song info.
 */
export const SessionDetailsProvider = ({
  children,
  sessionDetails
}: SessionDetailsProviderProps) => {
  return (
    <SessionDetailsContext.Provider value={sessionDetails}>
      {children}
    </SessionDetailsContext.Provider>
  );
};

export const useSessionDetails = () => useContext(SessionDetailsContext);
