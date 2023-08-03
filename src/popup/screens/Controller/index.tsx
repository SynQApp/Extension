import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Text, token } from '@synq/ui';
import styled, { css } from 'styled-components';

import { AlbumArt } from '~popup/components/AlbumArt';
import { PlayerControls } from '~popup/components/PlayerControls';
import { Queue } from '~popup/components/Queue';
import type { Expandable } from '~popup/types';
import { expandedStyle } from '~popup/util/expandedStyle';

import useControllerScreen from './useControllerScreen';

const PLAYER_HEIGHT = 135;

const ControllerScreen = () => {
  const {
    currentSongInfo,
    expanded,
    queueCount,
    setExpanded,
    showQueue,
    setShowQueue
  } = useControllerScreen();

  const handleShowQueueButtonPress = () => {
    setShowQueue(!showQueue);
  };

  return (
    <>
      <PlayerSection>
        <div>
          <Flex
            direction={expanded ? 'column' : 'row'}
            justify={expanded ? 'flex-start' : 'space-between'}
            align="center"
          >
            <AlbumArtContainer $expanded={expanded}>
              <AlbumArt src={currentSongInfo?.albumCoverUrl} />
            </AlbumArtContainer>
            <PlayerControlsContainer $expanded={expanded}>
              <PlayerControls />
            </PlayerControlsContainer>
          </Flex>
        </div>
        <ExpandButton onClick={handleShowQueueButtonPress}>
          <ExpandIcon
            icon={showQueue ? faChevronUp : faChevronDown}
            $expanded={expanded}
          />
        </ExpandButton>
      </PlayerSection>
      <QueueSection $show={showQueue}>
        <QueueHeader type="display" size="lg">
          Queue ({queueCount})
        </QueueHeader>
        <Queue start="next" />
      </QueueSection>
    </>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  height: ${PLAYER_HEIGHT}px;
  padding: ${token('spacing.xs')} ${token('spacing.md')} 0;
  position: relative;
`;

const AlbumArtContainer = styled.div<Expandable>`
  height: 105px;
  max-height: 105px;
  max-width: 105px;
  min-height: 105px;
  min-width: 105px;
  width: 105px;

  ${expandedStyle(
    css`
      height: 170px;
      max-height: initial;
      max-width: initial;
      min-height: initial;
      min-width: initial;
      width: 170px;
    `
  )}

  margin: 0 auto;
`;

const PlayerControlsContainer = styled.div<Expandable>`
  margin-left: ${token('spacing.sm')};
  margin-top: ${token('spacing.none')};
  width: calc(100% - 105px - ${token('spacing.sm')});

  ${expandedStyle(
    css`
      margin-left: ${token('spacing.none')};
      margin-top: ${token('spacing.md')};
      width: 100%;
    `
  )}
`;

const ExpandButton = styled.button`
  background: ${token('colors.surface')};
  border-top-left-radius: ${token('radii.md')};
  border-top-right-radius: ${token('radii.md')};
  border: none;
  bottom: 0;
  cursor: pointer;
  display: flex;
  height: 15px;
  justify-content: center;
  left: calc(50% - 25px);
  outline: none;
  position: absolute;
  width: 50px;
  display: flex;
  justify-content: center;
`;

const ExpandIcon = styled(FontAwesomeIcon)<Expandable>`
  color: ${token('colors.onBackground')};
`;

interface QueueSectionProps {
  $show: boolean;
}

const QueueSection = styled.section<QueueSectionProps>`
  background: ${token('colors.surface')};
  height: 0px;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  transition: height 0.2s ease-in-out, padding-top 0.2s ease-in-out;

  ${({ $show }) =>
    $show &&
    css`
      height: 390px;
    `}

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${token('colors.surface01')};
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      ${token('colors.base.orange.4')} 0%,
      ${token('colors.base.pink.4')} 100%
    );
    border-radius: 10px;

    &:hover {
      background: linear-gradient(
        to bottom,
        ${token('colors.base.orange.5')} 0%,
        ${token('colors.base.pink.5')} 100%
      );
    }
  }
`;

const QueueHeader = styled(Text)`
  margin: 0;
  font-weight: ${token('typography.fontWeights.semibold')};
  padding: ${token('spacing.sm')} ${token('spacing.md')} ${token('spacing.2xs')};
`;

export default ControllerScreen;
