import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import { useAppSelector } from '~store';
import { MusicControllerMessage, MusicService } from '~types';
import { sendMessage } from '~util/sendMessage';

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
  const currentTrack = useAppSelector((state) => state.currentTrack);
  const tab = useMusicServiceTab();

  const handleLikeClick = LIKE_ENABLED_SERVICES.has(tab?.musicService)
    ? () => {
        sendMessage({
          name: MusicControllerMessage.TOGGLE_LIKE
        });
      }
    : undefined;

  const handleDislikeClick = DISLIKE_ENABLED_SERVICES.has(tab?.musicService)
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
