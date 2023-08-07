import { Avatar, Button, Flex, Scrollable, Text, token } from '@synq/ui';
import { Link } from 'react-router-dom';
import { css, styled } from 'styled-components';

import { Player } from '~player-ui/components/Player';
import { Queue } from '~player-ui/components/Queue';
import { useExpanded } from '~player-ui/contexts/Expanded';
import type { Expandable } from '~player-ui/types';
import { expandedStyle } from '~player-ui/util/expandedStyle';
import Layout from '~sidebar/Layout';
import { GradientAddButton } from '~sidebar/components/AddGradientIcon';

import { useControllerScreen } from './useControllerScreen';

export const ControllerScreen = () => {
  const {
    expanded,
    handleNavigateToSearch,
    handleNavigateToQueue,
    queueDisplayCount,
    shouldDisplayQueue
  } = useControllerScreen();

  const renderQueueSection = () => {
    if (queueDisplayCount === 0) {
      return (
        <QueueEmptyStateText size="sm" type="body">
          No songs in the queue. Add songs to start listening with friends!
        </QueueEmptyStateText>
      );
    }

    if (shouldDisplayQueue) {
      return (
        <>
          <Scrollable>
            <Queue startAt="next" count={queueDisplayCount} />
          </Scrollable>
          <QueueFooter to="/queue">See All</QueueFooter>
        </>
      );
    }

    return (
      <QueueHiddenFlex justify="center" align="center">
        <Button
          onClick={handleNavigateToQueue}
          variant="secondary"
          size="small"
        >
          See Queue
        </Button>
      </QueueHiddenFlex>
    );
  };

  return (
    <Layout>
      <PlayerSection $expanded={expanded}>
        <Player />
      </PlayerSection>
      <SessionSection>
        <Flex align="center" justify="space-between">
          <AvatarContainer justify="space-between"> </AvatarContainer>
          <SessionLink to="/session">Session →</SessionLink>
        </Flex>
      </SessionSection>
      <QueueSection $expanded={expanded}>
        <QueueHeaderFlex align="center">
          <QueueHeaderText type="display" size="lg">
            Session Queue
          </QueueHeaderText>
          <GradientAddButton onClick={handleNavigateToSearch} />
        </QueueHeaderFlex>
        {renderQueueSection()}
      </QueueSection>
    </Layout>
  );
};

const PlayerSection = styled.section<Expandable>`
  background: ${token('colors.background')};
  height: 120px;
  padding: ${token('spacing.2xs')} ${token('spacing.md')} ${token('spacing.sm')};
  position: relative;

  ${expandedStyle(css`
    height: 325px;
    padding: ${token('spacing.xs')} ${token('spacing.md')}
      ${token('spacing.sm')};
  `)}
`;

const SessionSection = styled.section`
  background: ${token('colors.gradient')};
  height: 45px;
  padding: 0 ${token('spacing.sm')};
`;

const AvatarContainer = styled(Flex)`
  width: 100px;
`;

const SessionLink = styled(Link)`
  margin: 0;
  text-align: right;
  text-decoration: none;
  display: block;
  color: ${token('colors.onBackground')};
  cursor: pointer;
  font-family: ${token('typography.fontFamilies.body')};
  font-weight: ${token('typography.fontWeights.bold')};
  font-size: ${token('typography.fontSizes.sm')};
`;

const QueueSection = styled.section<Expandable>`
  background: ${token('colors.surface')};
  height: calc(100% - 175px - ${token('spacing.xs')} - ${token('spacing.sm')});
  width: 100%;

  ${expandedStyle(css`
    height: calc(
      100% - 380px - ${token('spacing.xs')} - ${token('spacing.sm')}
    );
  `)}
`;

const QueueHeaderFlex = styled(Flex)`
  padding: ${token('spacing.sm')} ${token('spacing.md')};
  height: initial;
  width: initial;
`;

const QueueHeaderText = styled(Text)`
  margin: 0;
  font-weight: ${token('typography.fontWeights.semibold')};
`;

const QueueHiddenFlex = styled(Flex)`
  height: unset;
  margin-top: ${token('spacing.md')};
`;

const QueueEmptyStateText = styled(Text)`
  color: ${token('colors.onBackgroundMedium')};
  text-align: center;
  margin: ${token('spacing.sm')} ${token('spacing.md')};
`;

const QueueFooter = styled(Link)`
  margin: 0;
  padding: ${token('spacing.xs')} ${token('spacing.md')} ${token('spacing.sm')};
  text-align: right;
  text-decoration: none;
  display: block;
  color: ${token('colors.base.orange.4')};
  cursor: pointer;
  font-family: ${token('typography.fontFamilies.body')};
  font-weight: ${token('typography.fontWeights.bold')};
  font-size: ${token('typography.fontSizes.sm')};
`;

export default ControllerScreen;
