import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

import { useSidebarMusicServiceTab } from './hooks/useSidebarMusicServiceTab';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const musicServiceTab = useSidebarMusicServiceTab();

  return (
    <MusicServiceTabProvider
      value={{
        musicServiceTab
      }}
    >
      {children}
    </MusicServiceTabProvider>
  );
};
