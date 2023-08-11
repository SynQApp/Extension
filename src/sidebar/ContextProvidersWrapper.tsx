import { useWindowSize } from 'usehooks-ts';

import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';

import { useMusicService } from './hooks/useMusicService';

const VERTICAL_BREAKPOINT = 775;

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const { height } = useWindowSize();
  const expanded = height > VERTICAL_BREAKPOINT;

  const musicService = useMusicService();

  return (
    <ExpandedProvider expanded={expanded}>
      <MusicServiceProvider value={musicService}>
        <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
      </MusicServiceProvider>
    </ExpandedProvider>
  );
};
