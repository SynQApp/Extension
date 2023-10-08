import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollable, Text, token } from '@synq/ui';
import styled, { css } from 'styled-components';

import Layout from '~ui/popup/Layout';
import { Player } from '~ui/popup/components/Player';
import { usePopupSettings } from '~ui/popup/contexts/PopupSettingsContext';
import { Queue } from '~ui/shared/components/Queue';

import useControllerScreen from './useControllerScreen';

const PLAYER_HEIGHT = 135;

const ControllerScreen = () => {
  const { queueCollapsible, document } = usePopupSettings();
  const { queueCount, showQueue, setShowQueue } = useControllerScreen();

  const handleShowQueueButtonPress = () => {
    setShowQueue(!showQueue);
  };

  return (
    <Layout>
      <PlayerSection>
        <div>
          <Player />
        </div>
        {queueCollapsible && (
          <ExpandButton onClick={handleShowQueueButtonPress}>
            <ExpandIcon
              height="16px"
              width="16px"
              icon={showQueue ? faChevronUp : faChevronDown}
            />
          </ExpandButton>
        )}
      </PlayerSection>
      <QueueSection $show={showQueue} $queueCollapsible={queueCollapsible}>
        <Scrollable height="100%">
          <QueueHeader type="display" size="lg">
            Queue ({queueCount})
          </QueueHeader>
          <Queue documentContainer={document} />
        </Scrollable>
      </QueueSection>
    </Layout>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  height: ${PLAYER_HEIGHT}px;
  padding: ${token('spacing.xs')} ${token('spacing.md')} ${token('spacing.xl')};
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

const ExpandIcon = styled(FontAwesomeIcon)`
  color: ${token('colors.onBackground')};
`;

interface QueueSectionProps {
  $queueCollapsible: boolean;
  $show: boolean;
}

const QueueSection = styled.section<QueueSectionProps>`
  background: ${token('colors.surface')};
  height: 0px;
  width: 100%;
  transition: height 0.2s ease-in-out, padding-top 0.2s ease-in-out;

  ${({ $show }) =>
    $show &&
    css`
      height: 390px;
    `}

  ${({ $queueCollapsible }) =>
    !$queueCollapsible &&
    css`
      height: calc(100% - ${PLAYER_HEIGHT}px);
    `}
`;

const QueueHeader = styled(Text)`
  margin: 0;
  font-weight: ${token('typography.fontWeights.semibold')};
  padding: ${token('spacing.sm')} ${token('spacing.md')} ${token('spacing.2xs')};
`;

export default ControllerScreen;
