import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, token } from '@synq/ui';
import styled, { css } from 'styled-components';

import { Player } from '~player-ui/components/Player';
import { Queue } from '~player-ui/components/Queue';
import type { Expandable } from '~popup/types';

import useControllerScreen from './useControllerScreen';

const PLAYER_HEIGHT = 135;

const ControllerScreen = () => {
  const { expanded, queueCount, showQueue, setShowQueue } =
    useControllerScreen();

  const handleShowQueueButtonPress = () => {
    setShowQueue(!showQueue);
  };

  return (
    <>
      <PlayerSection>
        <div>
          <Player />
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
        <Queue />
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
