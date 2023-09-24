import { List, token } from '@synq/ui';
import { styled } from 'styled-components';

import { ListItemMenu } from '../ListItemMenu';
import { TrackListItem } from '../TrackListItem';
import { useQueue } from './useQueue';

interface QueueProps {
  startAt?: 'top' | 'next';
  count?: number;
  documentContainer?: HTMLElement;
}

export const Queue = ({
  startAt = 'top',
  count,
  documentContainer
}: QueueProps) => {
  const { handlePlayQueueTrack, musicServiceName, queueItems } = useQueue(
    startAt,
    count
  );

  return (
    <div>
      <QueueList>
        {queueItems.map(({ track, isPlaying, ...queueItem }, index) => (
          <div>
            <TrackListItem
              active={isPlaying}
              imageAlt={`Album cover for ${track?.albumName}`}
              imageIconOverlay={isPlaying ? 'playing' : 'play'}
              imageUrl={track?.albumCoverUrl ?? ''}
              key={index}
              onImageClick={() =>
                track && handlePlayQueueTrack(track?.id, index)
              }
              primaryText={track?.name ?? 'Unknown Track'}
              rightNode={
                <ListItemMenu
                  portalContainer={documentContainer}
                  menuItems={[
                    {
                      icon: 'musicNote',
                      text: musicServiceName,
                      // TODO: Implement music service click handler
                      onClick: () => console.info(musicServiceName)
                    },
                    {
                      icon: 'share',
                      text: 'Share',
                      // TODO: Implement share click handler
                      onClick: () => console.info('Share')
                    }
                  ]}
                />
              }
              secondaryText={`${track?.artistName} • ${track?.albumName}`}
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
