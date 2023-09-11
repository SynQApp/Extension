import { useWindowSize } from 'usehooks-ts';

import { ExpandedProvider } from '~ui/shared/contexts/Expanded';
import { MusicServiceTabProvider } from '~ui/shared/contexts/MusicServiceTab';

import { useSidebarMusicServiceTab } from './hooks/useSidebarMusicServiceTab';

const VERTICAL_BREAKPOINT = 775;

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const { height } = useWindowSize();
  const expanded = height > VERTICAL_BREAKPOINT;

  const musicServiceTab = useSidebarMusicServiceTab();

  return (
    <ExpandedProvider expanded={expanded}>
      <MusicServiceTabProvider
        value={{
          musicServiceTab
        }}
      >
        {children}
      </MusicServiceTabProvider>
    </ExpandedProvider>
  );
};
