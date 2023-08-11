import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { SessionDetailsProvider } from '~player-ui/contexts/SessionContext';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';

import { useMusicService } from './hooks/useMusicService';
import { useSessionDetails } from './hooks/useSessionDetails';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const musicService = useMusicService();

  const sessionDetails = useSessionDetails();

  return (
    <MusicServiceProvider value={musicService}>
      <SessionDetailsProvider sessionDetails={sessionDetails}>
        <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
      </SessionDetailsProvider>
    </MusicServiceProvider>
  );
};
