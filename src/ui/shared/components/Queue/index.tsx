import { List, token } from '@synqapp/ui';
import { styled } from 'styled-components';

import type { MusicService } from '~/types';

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
                track?.link && (
                  <ListItemMenu
                    portalContainer={documentContainer.body}
                    menuItems={[
                      {
                        icon: 'musicNote',
                        text: `View on ${musicServiceName}`,
                        onClick: () => {
                          handleVisitTrackOnMusicService(track?.link);
                        }
                      }
                    ]}
                  />
                )
              }
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
