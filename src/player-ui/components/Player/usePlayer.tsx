import { useCurrentSongInfo } from '~player-ui/contexts/CurrentSongInfo';
import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicService } from '~player-ui/contexts/MusicService';
import { MusicControllerMessage, MusicService } from '~types';

const LIKE_ENABLED_SERVICES = new Set([
  MusicService.AMAZON_MUSIC,
  MusicService.SPOTIFY,
  MusicService.YOUTUBE_MUSIC
]);

const DISLIKE_ENABLED_SERVICES = new Set([
  MusicService.AMAZON_MUSIC,
  MusicService.YOUTUBE_MUSIC
]);

export const usePlayer = () => {
  const expanded = useExpanded();
  const currentSongInfo = useCurrentSongInfo();
  const { musicService, sendMessage } = useMusicService();

  const handleLikeClick = LIKE_ENABLED_SERVICES.has(musicService)
    ? () => {
        sendMessage({
          name: MusicControllerMessage.TOGGLE_LIKE
        });
      }
    : undefined;

  const handleDislikeClick = DISLIKE_ENABLED_SERVICES.has(musicService)
    ? () => {
        sendMessage({
          name: MusicControllerMessage.TOGGLE_DISLIKE
        });
      }
    : undefined;

  return {
    expanded,
    currentSongInfo,
    handleLikeClick,
    handleDislikeClick
  };
};
