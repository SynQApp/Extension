import type { MusicService } from '~/types';
import adapters from '~adapters';
import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

export const useAlbumArt = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const currentTrack = musicServiceTab?.currentTrack;

  const adapter = adapters.find(
    (adapter) => adapter.id === musicServiceTab?.musicService
  );

  const handleLikeClick = !adapter?.disabledFeatures?.includes('like')
    ? () => {
        sendToContent(
          {
            name: MusicControllerMessage.TOGGLE_LIKE
          },
          musicServiceTab?.tabId
        );
        sendAnalytic({
          name: 'toggle_like'
        });
      }
    : undefined;

  const handleDislikeClick = !adapter?.disabledFeatures?.includes('dislike')
    ? () => {
        sendToContent(
          {
            name: MusicControllerMessage.TOGGLE_DISLIKE
          },
          musicServiceTab?.tabId
        );
        sendAnalytic({
          name: 'toggle_dislike'
        });
      }
    : undefined;

  return {
    trackName: currentTrack?.name,
    isLiked: currentTrack?.isLiked,
    isDisliked: currentTrack?.isDisliked,
    src: currentTrack?.albumCoverUrl,
    handleLikeClick,
    handleDislikeClick
  };
};
