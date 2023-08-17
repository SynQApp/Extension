import { token } from '@synq/ui';
import type React from 'react';
import { styled } from 'styled-components';

import Header from '~player-ui/components/Header';
import { useExpanded } from '~player-ui/contexts/Expanded';
import type { Expandable } from '~player-ui/types';
import { useAppSelector } from '~store';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const Layout = ({ children, header }: LayoutProps) => {
  const expanded = useExpanded();

  return (
    <Container $expanded={expanded}>
      {header ?? (
        <Header
          actionButton={{ name: 'Invite Friends', onClick: console.log }}
        />
      )}
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
