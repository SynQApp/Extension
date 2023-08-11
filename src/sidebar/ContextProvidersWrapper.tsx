import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';

import { useMusicService } from './hooks/useMusicService';
import { useSessionDetails } from './hooks/useSessionDetails';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const musicService = useMusicService();

  return (
    <MusicServiceProvider value={musicService}>
      <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
    </MusicServiceProvider>
  );
};
