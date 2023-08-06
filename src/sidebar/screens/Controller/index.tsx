import { Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { Player } from '~player-ui/components/Player';
import { Queue } from '~player-ui/components/Queue';

import { useControllerScreen } from './useControllerScreen';

export const ControllerScreen = () => {
  const { queueCount } = useControllerScreen();

  return (
    <>
      <PlayerSection>
        <Player />
      </PlayerSection>
      <QueueSection>
        <QueueHeader type="display" size="lg">
          Session Queue ({queueCount})
        </QueueHeader>
        <Queue />
      </QueueSection>
    </>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  height: 325px;
  padding: ${token('spacing.xs')} ${token('spacing.md')} ${token('spacing.sm')};
  position: relative;
`;

const QueueSection = styled.section`
  background: ${token('colors.surface')};
  height: calc(100% - 335px - ${token('spacing.xs')} - ${token('spacing.sm')});
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;

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
