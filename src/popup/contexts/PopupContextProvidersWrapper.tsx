import { CurrentSongInfoProvider } from '~player-ui/contexts/CurrentSongInfo';
import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import {
  type PlaybackState,
  PlaybackStateProvider
} from '~player-ui/contexts/PlaybackState';
import { useChromeMusicController } from '~popup/hooks/useChromeEvents';
import { useMusicService } from '~popup/hooks/useMusicService';
import { EventMessage, MusicControllerMessage } from '~types';
import type { SongInfo } from '~types';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const currentSongInfo = useChromeMusicController<SongInfo>(
    MusicControllerMessage.GET_CURRENT_SONG_INFO,
    EventMessage.SONG_INFO_UPDATED
  );

  const playbackState = useChromeMusicController<PlaybackState>(
    MusicControllerMessage.GET_PLAYER_STATE,
    EventMessage.PLAYBACK_UPDATED
  );

  const musicService = useMusicService();

  return (
    <ExpandedProvider expanded={false}>
      <CurrentSongInfoProvider currentSongInfo={currentSongInfo}>
        <PlaybackStateProvider playbackState={playbackState}>
          <MusicServiceProvider value={musicService}>
            {children}
          </MusicServiceProvider>
        </PlaybackStateProvider>
      </CurrentSongInfoProvider>
    </ExpandedProvider>
  );
};

export default PopupContextProvidersWrapper;
