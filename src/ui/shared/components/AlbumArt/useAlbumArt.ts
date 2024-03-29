import type { MusicService } from '~/types';
import adapters from '~adapters';
import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendAnalytic } from '~util/analytics';

const LIKE_ENABLED_SERVICES = new Set<MusicService | undefined>(
  adapters
    .filter((adapter) => !adapter.disabledFeatures?.includes('like'))
    .map((adapter) => adapter.id)
);

const DISLIKE_ENABLED_SERVICES = new Set<MusicService | undefined>(
  adapters
    .filter((adapter) => !adapter.disabledFeatures?.includes('dislike'))
    .map((adapter) => adapter.id)
);

export const useAlbumArt = () => {
  const { musicServiceTab } = useMusicServiceTab();
  const currentTrack = musicServiceTab?.currentTrack;

  const handleLikeClick = LIKE_ENABLED_SERVICES.has(
    musicServiceTab?.musicService
  )
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

  const handleDislikeClick = DISLIKE_ENABLED_SERVICES.has(
    musicServiceTab?.musicService
  )
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
