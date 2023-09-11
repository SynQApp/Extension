import { Flex, Scrollable, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { Queue } from '~ui/shared/components/Queue';
import Layout from '~ui/sidebar/Layout';
import { GradientAddButton } from '~ui/sidebar/components/GradientAddButton';
import { ScreenHeader } from '~ui/sidebar/components/ScreenHeader';
import { useSidebarRoot } from '~ui/sidebar/contexts/SidebarRoot';

import { useQueue } from './useQueue';

export const QueueScreen = () => {
  const { handleNavigateToSearch } = useQueue();
  const sidebarRoot = useSidebarRoot();

  return (
    <Layout
      header={
        <ScreenHeader>
          <Flex>
            <Heading type="display" size="xl">
              Queue
            </Heading>
            <GradientAddButton onClick={handleNavigateToSearch} />
          </Flex>
        </ScreenHeader>
      }
    >
      <Scrollable height="calc(100% - 5px)">
        <Queue documentContainer={sidebarRoot} />
      </Scrollable>
    </Layout>
  );
};

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;

export default QueueScreen;
