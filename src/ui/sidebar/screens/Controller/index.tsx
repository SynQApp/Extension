import { token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { Player } from '~ui/shared/components/Player';
import type { Expandable } from '~ui/shared/types';
import { expandedStyle } from '~ui/shared/util/expandedStyle';
import Layout from '~ui/sidebar/Layout';

import { QueueSection } from './QueueSection';
import { SessionSection } from './SessionSection';
import { useControllerScreen } from './useControllerScreen';

export const ControllerScreen = () => {
  const {
    expanded,
    handleNavigateToSearch,
    handleNavigateToQueue,
    listeners,
    sidebarRoot,
    queueDisplayCount,
    shouldDisplayQueue
  } = useControllerScreen();

  return (
    <Layout>
      <PlayerSection $expanded={expanded}>
        <Player />
      </PlayerSection>
      <SessionSection listeners={listeners} />
      <QueueSection
        expanded={expanded}
        handleNavigateToQueue={handleNavigateToQueue}
        handleNavigateToSearch={handleNavigateToSearch}
        queueDisplayCount={queueDisplayCount}
        shouldDisplayQueue={shouldDisplayQueue}
        sidebarRoot={sidebarRoot}
      />
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

export default ControllerScreen;
