import { List, token } from '@synq/ui';
import { styled } from 'styled-components';

import { QueueItem } from '../QueueItem';
import { useQueue } from './useQueue';

interface QueueProps {
  start: 'beginning' | 'next';
  count?: number;
}

export const Queue = ({ start, count }: QueueProps) => {
  const {
    currentTrackId,
    queueItems,
    handlePlayQueueTrack,
    musicServiceName,
    theme
  } = useQueue();

  return (
    <QueueList>
      {queueItems.map((item, index) => (
        <QueueItem
          key={index}
          albumCoverUrl={item.albumCoverUrl}
          trackName={item.trackName}
          artistName={item.artistName}
          albumName={item.albumName}
          onClick={() => handlePlayQueueTrack(item.trackId, index)}
          secondaryActions={[
            {
              iconName: 'musicNote',
              text: musicServiceName,
              // TODO: Implement music service click handler
              onClick: () => console.info(musicServiceName)
            },
            {
              iconName: 'share',
              text: 'Share',
              // TODO: Implement share click handler
              onClick: () => console.info('Share')
            }
          ]}
          active={item.trackId === currentTrackId}
        />
      ))}
    </QueueList>
  );
};

const QueueList = styled(List)`
  background: ${token('colors.surface')};
`;
