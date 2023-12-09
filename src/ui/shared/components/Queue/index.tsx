import { List, token } from '@synq/ui';
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
    musicService,
    musicServiceName,
    queueItems
  } = useQueue(startAt, count);

  console.log({ musicService, musicServiceName });

  return (
    <div>
      <QueueList>
        {queueItems.map(({ track, isPlaying }, index) => (
          <div>
            <TrackListItem
              active={isPlaying}
              documentContainer={documentContainer}
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
                  portalContainer={documentContainer.body}
                  menuItems={[
                    {
                      icon: 'musicNote',
                      text: musicServiceName,
                      // TODO: Implement music service click handler
                      onClick: () => {
                        handleVisitTrackOnMusicService(musicService, track?.id);
                      }
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
