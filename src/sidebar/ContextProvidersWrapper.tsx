import { useWindowSize } from 'usehooks-ts';

import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceTabProvider } from '~player-ui/contexts/MusicServiceTab';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';

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
        <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
      </MusicServiceTabProvider>
    </ExpandedProvider>
  );
};
