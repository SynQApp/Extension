import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import {
  type PlaybackState,
  PlaybackStateProvider
} from '~player-ui/contexts/PlaybackState';
import { SessionDetailsProvider } from '~player-ui/contexts/SessionContext';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';
import { EventMessage, MusicControllerMessage } from '~types';

import { useDocumentMusicController } from './hooks/useDocumentMusicController';
import { useMusicService } from './hooks/useMusicService';
import { useSessionDetails } from './hooks/useSessionDetails';
import { useWindowSize } from './hooks/useWindowSize';

const VERTICAL_BREAKPOINT = 775;

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const { height } = useWindowSize();
  const expanded = height > VERTICAL_BREAKPOINT;

  const musicService = useMusicService();

  const playbackState = useDocumentMusicController<PlaybackState>(
    MusicControllerMessage.GET_PLAYER_STATE,
    EventMessage.PLAYBACK_UPDATED
  );

  const sessionDetails = useSessionDetails();

  return (
    <MusicServiceProvider value={musicService}>
      <SessionDetailsProvider sessionDetails={sessionDetails}>
        <PlaybackStateProvider playbackState={playbackState}>
          <ExpandedProvider expanded={expanded}>
            <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
          </ExpandedProvider>
        </PlaybackStateProvider>
      </SessionDetailsProvider>
    </MusicServiceProvider>
  );
};
