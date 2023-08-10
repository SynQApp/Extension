import React, { createContext, useContext, useEffect, useState } from 'react';

const ExpandedContext = createContext<boolean>(false);

interface ExpandedProviderProps {
  children: React.ReactNode;
  expanded: boolean;
}

/**
 * Get the current expanded state and a function to set the expanded state.
 */
export const ExpandedProvider = ({
  children,
  expanded
}: ExpandedProviderProps) => {
  return (
    <ExpandedContext.Provider value={expanded}>
      {children}
    </ExpandedContext.Provider>
  );
};

export const useExpanded = () => useContext(ExpandedContext);
