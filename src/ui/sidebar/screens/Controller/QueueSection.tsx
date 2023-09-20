import { Button, Flex, Scrollable, Text, token } from '@synq/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Queue } from '~ui/shared/components/Queue';
import { EmptyText } from '~ui/sidebar/components/EmptyText';
import { GradientAddButton } from '~ui/sidebar/components/GradientAddButton';

interface QueueSectionProps {
  queueDisplayCount: number;
  shouldDisplayQueue: boolean;
  handleNavigateToQueue: () => void;
  handleNavigateToSearch: () => void;
  sidebarRoot: HTMLElement | null;
}

export const QueueSection = ({
  queueDisplayCount,
  shouldDisplayQueue,
  handleNavigateToQueue,
  handleNavigateToSearch,
  sidebarRoot
}: QueueSectionProps) => {
  const renderQueueSectionContents = () => {
    if (queueDisplayCount === 0) {
      return (
        <EmptyText size="sm" type="body">
          No songs in the queue. Add songs to start listening with friends!
        </EmptyText>
      );
    }

    if (shouldDisplayQueue) {
      return (
        <>
          <Scrollable>
            <Queue
              startAt="next"
              count={queueDisplayCount}
              documentContainer={sidebarRoot}
            />
          </Scrollable>
          <QueueFooter to="/queue">
            <Text type="body" size="sm" gradient as="span">
              See All
            </Text>
          </QueueFooter>
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
          See Queue →
        </Button>
      </QueueHiddenFlex>
    );
  };

  return (
    <Container>
      <QueueHeaderFlex align="center">
        <QueueHeaderText type="display" size="lg">
          Queue
        </QueueHeaderText>
        <GradientAddButton onClick={handleNavigateToSearch} />
      </QueueHeaderFlex>
      {renderQueueSectionContents()}
    </Container>
  );
};

const Container = styled.section`
  background: ${token('colors.surface')};
  height: calc(100% - 175px - ${token('spacing.xs')} - ${token('spacing.sm')});
  width: 100%;
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

const QueueFooter = styled(Link)`
  margin: 0;
  padding: ${token('spacing.xs')} ${token('spacing.md')} ${token('spacing.sm')};
  text-align: right;
  text-decoration: none;
  display: block;
  cursor: pointer;
  font-weight: ${token('typography.fontWeights.bold')};
`;
