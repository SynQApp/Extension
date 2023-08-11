import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import {
  type PlaybackState,
  PlaybackStateProvider
} from '~player-ui/contexts/PlaybackState';
import { useChromeMusicController } from '~popup/hooks/useChromeEvents';
import { useMusicService } from '~popup/hooks/useMusicService';
import { EventMessage, MusicControllerMessage } from '~types';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const playbackState = useChromeMusicController<PlaybackState>(
    MusicControllerMessage.GET_PLAYER_STATE,
    EventMessage.PLAYBACK_UPDATED
  );

  const musicService = useMusicService();

  return (
    <ExpandedProvider expanded={false}>
      <PlaybackStateProvider playbackState={playbackState}>
        <MusicServiceProvider value={musicService}>
          {children}
        </MusicServiceProvider>
      </PlaybackStateProvider>
    </ExpandedProvider>
  );
};

export default PopupContextProvidersWrapper;
