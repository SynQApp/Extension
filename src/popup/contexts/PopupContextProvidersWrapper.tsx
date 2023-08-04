import { CurrentSongInfoProvider } from '~player-ui/contexts/CurrentSongInfo';
import { ExpandedProvider } from '~player-ui/contexts/Expanded';
import { MusicServiceProvider } from '~player-ui/contexts/MusicService';
import { PlaybackStateProvider } from '~player-ui/contexts/PlaybackState';
import { useCurrentSongInfo } from '~popup/hooks/useCurrentSongInfo';
import { useMusicService } from '~popup/hooks/useMusicService';
import { usePlaybackState } from '~popup/hooks/usePlaybackState';

export const PopupContextProvidersWrapper = ({ children }: any) => {
  const currentSongInfo = useCurrentSongInfo();
  const playbackState = usePlaybackState();
  const { musicService, sendMessage } = useMusicService();

  return (
    <ExpandedProvider expanded={false}>
      <CurrentSongInfoProvider currentSongInfo={currentSongInfo}>
        <PlaybackStateProvider playbackState={playbackState}>
          <MusicServiceProvider
            musicService={musicService}
            sendMessage={sendMessage}
          >
            {children}
          </MusicServiceProvider>
        </PlaybackStateProvider>
      </CurrentSongInfoProvider>
    </ExpandedProvider>
  );
};

export default PopupContextProvidersWrapper;
