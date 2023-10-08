import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

import { useDocumentMusicServiceTab } from '../hooks/useDocumentMusicServiceTab';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const DocumentContextProvidersWrapper = ({
  children
}: ContextsWrapperProps) => {
  const musicServiceTab = useDocumentMusicServiceTab();

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
