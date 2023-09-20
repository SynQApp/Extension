import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { Header } from './Header';
import { PlayerBar } from './PlayerBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <Header />
      {children}
      <PlayerBar />
    </Container>
  );
};

const Container = styled.div`
  background: ${token('colors.background')};
  height: 100vh;
  width: 100vw;
  position: fixed;
`;
