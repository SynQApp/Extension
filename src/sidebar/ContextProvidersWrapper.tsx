import { CurrentSongInfoProvider } from '~player-ui/contexts/CurrentSongInfo';
import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import {
  type PlaybackState,
  PlaybackStateProvider
} from '~player-ui/contexts/PlaybackState';
import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';
import { EventMessage } from '~types/Events';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import type { SongInfo } from '~types/PlayerState';

import { useDocumentMusicController } from './hooks/useDocumentMusicController';
import { useMusicService } from './hooks/useMusicService';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export const ContextProvidersWrapper = ({ children }: ContextsWrapperProps) => {
  const musicService = useMusicService();

  const currentSongInfo = useDocumentMusicController<SongInfo>(
    MusicControllerMessage.GET_CURRENT_SONG_INFO,
    EventMessage.SONG_INFO_UPDATED
  );

  const playbackState = useDocumentMusicController<PlaybackState>(
    MusicControllerMessage.GET_PLAYER_STATE,
    EventMessage.PLAYBACK_UPDATED
  );

  return (
    <MusicServiceProvider value={musicService}>
      <PlaybackStateProvider playbackState={playbackState}>
        <CurrentSongInfoProvider currentSongInfo={currentSongInfo}>
          <ExpandedProvider expanded={true}>
            <MarqueeStylesProvider>{children}</MarqueeStylesProvider>
          </ExpandedProvider>
        </CurrentSongInfoProvider>
      </PlaybackStateProvider>
    </MusicServiceProvider>
  );
};
