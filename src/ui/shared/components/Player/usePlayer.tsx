import { useAppSelector } from '~store';
import { MusicControllerMessage, MusicService } from '~types';
import { useExpanded } from '~ui/shared/contexts/Expanded';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
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
  const { musicServiceTab } = useMusicServiceTab();

  const handleLikeClick = LIKE_ENABLED_SERVICES.has(
    musicServiceTab?.musicService
  )
    ? () => {
        sendMessage(
          {
            name: MusicControllerMessage.TOGGLE_LIKE
          },
          musicServiceTab.tabId
        );
      }
    : undefined;

  const handleDislikeClick = DISLIKE_ENABLED_SERVICES.has(
    musicServiceTab?.musicService
  )
    ? () => {
        sendMessage(
          {
            name: MusicControllerMessage.TOGGLE_DISLIKE
          },
          musicServiceTab.tabId
        );
      }
    : undefined;

  return {
    expanded,
    currentTrack,
    handleLikeClick,
    handleDislikeClick
  };
};
