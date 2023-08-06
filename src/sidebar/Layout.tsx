import { token } from '@synq/ui';
import { styled } from 'styled-components';

import Header from '~player-ui/components/Header';
import { useExpanded } from '~player-ui/contexts/Expanded';
import type { Expandable } from '~popup/types';

const Layout = ({ children }) => {
  const expanded = useExpanded();

  return (
    <Container $expanded={expanded}>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div<Expandable>`
  background: ${token('colors.background')};
  transition: all 0.2s ease-in-out;
  width: 350px;
  height: 100vh;
  position: relative;
  z-index: 1000;
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
