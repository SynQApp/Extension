import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, List, ListItem, token } from '@synq/ui';
import { styled } from 'styled-components';

import { MarqueeText } from '../MarqueeText';
import { useQueue } from './useQueue';

interface QueueProps {
  start: 'beginning' | 'next';
  count?: number;
}

export const Queue = ({ start, count }: QueueProps) => {
  const { queueItems, handlePlayQueueTrack, theme } = useQueue({
    start,
    count
  });

  return (
    <QueueContainer>
      <QueueList>
        {queueItems.map((item) => (
          <ListItem
            key={item.trackId}
            avatar={
              <Image
                src={item.albumCoverUrl}
                alt={`Album art for ${item.trackName}`}
                height="60px"
                width="60px"
                radius="lg"
              />
            }
            secondaryAction={
              <FontAwesomeIcon
                icon={faEllipsisV}
                size="lg"
                color={theme.colors.onBackground}
                width="20px"
              />
            }
            onClick={() => handlePlayQueueTrack(item.trackId)}
          >
            <QueueItemContent>
              <QueueItemTitle type="display" size="sm">
                {item.trackName}
              </QueueItemTitle>
              <QueueItemArtist type="body" size="xs">
                {item.artistName} • {item.albumName}
              </QueueItemArtist>
            </QueueItemContent>
          </ListItem>
        ))}
      </QueueList>
    </QueueContainer>
  );
};

const QueueContainer = styled.div``;

const QueueList = styled(List)`
  background: ${token('colors.surface01')};
`;

const QueueItemContent = styled.div``;

const QueueItemTitle = styled(MarqueeText)`
  font-weight: ${token('typography.fontWeights.bold')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;

const QueueItemArtist = styled(MarqueeText)`
  color: ${token('colors.onBackgroundMedium')};
  margin-top: ${token('spacing.2xs')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;
