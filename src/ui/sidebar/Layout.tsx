import { token } from '@synq/ui';
import type React from 'react';
import { styled } from 'styled-components';

import Header from '~ui/shared/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const Layout = ({ children, header }: LayoutProps) => {
  return (
    <Container>
      {header ?? (
        <Header
          actionButton={{ name: 'Invite Friends', onClick: console.log }}
        />
      )}
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
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
