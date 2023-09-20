import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { Player } from '~ui/popup/components/Player';
import Layout from '~ui/sidebar/Layout';

import { QueueSection } from './QueueSection';
import { SessionSection } from './SessionSection';
import { useControllerScreen } from './useControllerScreen';

export const ControllerScreen = () => {
  const {
    handleNavigateToSearch,
    handleNavigateToQueue,
    listeners,
    sidebarRoot,
    queueDisplayCount,
    shouldDisplayQueue
  } = useControllerScreen();

  return (
    <Layout>
      <PlayerSection>
        <Player />
      </PlayerSection>
      <SessionSection listeners={listeners} />
      <QueueSection
        handleNavigateToQueue={handleNavigateToQueue}
        handleNavigateToSearch={handleNavigateToSearch}
        queueDisplayCount={queueDisplayCount}
        shouldDisplayQueue={shouldDisplayQueue}
        sidebarRoot={sidebarRoot}
      />
    </Layout>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  height: 120px;
  padding: ${token('spacing.2xs')} ${token('spacing.md')} ${token('spacing.sm')};
  position: relative;
`;

export default ControllerScreen;
