import { type IconProps, List, token } from '@synqapp/ui';
import { useCallback } from 'react';
import { styled } from 'styled-components';


import { ListItemMenu } from '../ListItemMenu';
import { TrackListItem } from '../TrackListItem';
import { useQueue } from './useQueue';

interface QueueProps {
  startAt?: 'top' | 'next';
  count?: number;
  documentContainer?: Document;
}

export const Queue = ({
  startAt = 'top',
  count,
  documentContainer = document
}: QueueProps) => {
  const {
    handlePlayQueueTrack,
    handleVisitTrackOnMusicService,
    adapter,
    musicServiceName,
    queueItems
  } = useQueue(startAt, count);

  const getMenuItems = useCallback(
    ({ link }: { link: string }) => {
      const defaultMenuItems = [
        {
          icon: 'musicNote' as IconProps['icon'],
          text: `View on ${musicServiceName}`,
          onClick: () => handleVisitTrackOnMusicService(link)
        }
      ];

      const menuItems = adapter?.menuItems
        ? adapter.menuItems({
            link,
            clickEvent: handleVisitTrackOnMusicService
          })
        : defaultMenuItems;

      return <ListItemMenu menuItems={menuItems} />;
    },
    [adapter, handleVisitTrackOnMusicService, musicServiceName]
  );

  return (
    <div>
      <QueueList>
        {queueItems.map(({ track, isPlaying }, index) => (
          <div key={track?.id}>
            <TrackListItem
              active={isPlaying}
              documentContainer={documentContainer}
              imageAlt={`Album cover for ${track?.albumName}`}
              imageIconOverlay={isPlaying ? 'playing' : 'play'}
              imageUrl={track?.albumCoverUrl ?? ''}
              onImageClick={() =>
                track && handlePlayQueueTrack(track?.id, index)
              }
              primaryText={track?.name ?? 'Unknown Track'}
              rightNode={track?.link && getMenuItems({ link: track.link })}
              secondaryText={`${track?.artistName}${
                track?.albumName && ` • ${track?.albumName}`
              }`}
            />
          </div>
        ))}
      </QueueList>
    </div>
  );
};

const QueueList = styled(List)`
  background: ${token('colors.surface')};
`;
