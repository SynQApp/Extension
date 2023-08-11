import { useMusicService } from '~player-ui/contexts/MusicService';
import { useAppSelector } from '~store';
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
  const expanded = useAppSelector((state) => state.expanded);
  const currentTrack = useAppSelector((state) => state.currentTrack);
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
    currentTrack,
    handleLikeClick,
    handleDislikeClick
  };
};
