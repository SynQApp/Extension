import React, { createContext, useContext, useEffect, useState } from 'react';

import { ALL_URL_MATCHES } from '~constants/urls';

interface ExpandedContextValue {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpandedContext = createContext<ExpandedContextValue>({
  expanded: false,
  setExpanded: () => {}
});

interface ExpandedProviderProps {
  children: React.ReactNode;
}

/**
 * Get the current expanded state and a function to set the expanded state.
 */
export const ExpandedProvider = ({ children }: ExpandedProviderProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const value = {
    expanded,
    setExpanded
  };

  return (
    <ExpandedContext.Provider value={value}>
      {children}
    </ExpandedContext.Provider>
  );
};

export const useExpanded = () => useContext(ExpandedContext);
