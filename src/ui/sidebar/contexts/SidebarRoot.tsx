import { createContext, useContext } from 'react';

const SidebarRootContext = createContext<HTMLElement | null>(null);

interface SidebarRootProviderProps {
  children: React.ReactNode;
  sidebarRoot: HTMLElement | null;
}

/**
 * Get the current song info.
 */
export const SidebarRootProvider = ({
  children,
  sidebarRoot
}: SidebarRootProviderProps) => {
  return (
    <SidebarRootContext.Provider value={sidebarRoot}>
      {children}
    </SidebarRootContext.Provider>
  );
};

export const useSidebarRoot = () => useContext(SidebarRootContext);
