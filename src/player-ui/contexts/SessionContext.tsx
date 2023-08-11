import { createContext, useContext } from 'react';

import type { Session } from '~types';

const SessionDetailsContext = createContext<Session | null>(null);

interface SessionDetailsProviderProps {
  children: React.ReactNode;
  sessionDetails: Session | null;
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
