import { List, token } from '@synq/ui';
import { styled } from 'styled-components';

import { TrackListItem } from '../TrackListItem';
import { TrackListItemMenu } from '../TrackListItemMenu';
import { useQueue } from './useQueue';

interface QueueProps {
  startAt?: 'top' | 'next';
  count?: number;
  documentContainer?: HTMLElement | ShadowRoot;
}

export const Queue = ({
  startAt = 'top',
  count,
  documentContainer
}: QueueProps) => {
  const { queueItems, handlePlayQueueTrack, musicServiceName } = useQueue(
    startAt,
    count
  );

  return (
    <QueueList>
      {queueItems.map(({ songInfo, isPlaying }, index) => (
        <TrackListItem
          active={isPlaying}
          imageAlt={`Album cover for ${songInfo?.albumName}`}
          imageIconOverlay={isPlaying ? 'playing' : 'play'}
          imageUrl={songInfo?.albumCoverUrl}
          key={index}
          onClick={() => handlePlayQueueTrack(songInfo?.trackId, index)}
          primaryText={songInfo?.trackName}
          rightNode={
            <TrackListItemMenu
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
          secondaryText={`${songInfo?.artistName} • ${songInfo?.albumName}`}
        />
      ))}
    </QueueList>
  );
};

const QueueList = styled(List)`
  background: ${token('colors.surface')};
`;
