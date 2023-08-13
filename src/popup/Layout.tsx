import { token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { useExpanded } from '~player-ui/contexts/Expanded';
import { useAppSelector } from '~store';

import Header from '../player-ui/components/Header';
import { type Expandable } from '../player-ui/types';
import { expandedStyle } from '../player-ui/util/expandedStyle';

const Layout = ({ children }) => {
  const expanded = useExpanded();
  const tabs = useAppSelector((state) => state.musicServiceTabs);

  console.log({ tabs });

  return (
    <Container $expanded={expanded}>
      <Header
        actionButton={{
          name: 'Start Session',
          // TODO: Implement session start handler
          onClick: () => console.info('Start session')
        }}
      />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div<Expandable>`
  background: ${token('colors.background')};
  transition: all 0.2s ease-in-out;
  width: 350px;

  ${expandedStyle(css`
    width: 310px;
    height: 410px;
  `)}
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
