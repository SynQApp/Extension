import {
  DragDropContext,
  Draggable,
  type DraggingStyle,
  Droppable,
  type NotDraggingStyle
} from '@synq/react-beautiful-dnd';
import { List, token } from '@synq/ui';
import { styled } from 'styled-components';

import { TrackListItem } from '../TrackListItem';
import { TrackListItemMenu } from '../TrackListItemMenu';
import { useQueue } from './useQueue';

interface QueueProps {
  startAt?: 'top' | 'next';
  count?: number;
  documentContainer?: HTMLElement;
}

const getAxisLockStyle = (style: DraggingStyle | NotDraggingStyle) => {
  if (style.transform) {
    const axisLockY =
      'translate(0px' +
      style.transform.slice(
        style.transform.indexOf(','),
        style.transform.length
      );
    return {
      ...style,
      transform: axisLockY
    };
  }
  return style;
};

export const Queue = ({
  startAt = 'top',
  count,
  documentContainer
}: QueueProps) => {
  const {
    handlePlayQueueTrack,
    handleQueueItemReorder,
    inSession,
    musicServiceName,
    queueItems
  } = useQueue(startAt, count);

  return (
    <DragDropContext
      onDragEnd={handleQueueItemReorder}
      stylesInsertionPoint={documentContainer}
    >
      <Droppable droppableId="queue">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <QueueList>
              {queueItems.map(({ songInfo, isPlaying }, index) => (
                <Draggable draggableId={songInfo?.id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      {...dragProvided.draggableProps}
                      ref={dragProvided.innerRef}
                      style={getAxisLockStyle(
                        dragProvided.draggableProps.style
                      )}
                    >
                      <TrackListItem
                        active={isPlaying || snapshot.isDragging}
                        imageAlt={`Album cover for ${songInfo?.albumName}`}
                        imageIconOverlay={isPlaying ? 'playing' : 'play'}
                        imageUrl={songInfo?.albumCoverUrl}
                        key={index}
                        onImageClick={() =>
                          handlePlayQueueTrack(songInfo?.id, index)
                        }
                        primaryText={songInfo?.name}
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
                        handleProps={inSession && dragProvided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </QueueList>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const QueueList = styled(List)`
  background: ${token('colors.surface')};
`;
