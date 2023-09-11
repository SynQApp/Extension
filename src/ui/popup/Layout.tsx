import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { useAppSelector } from '~store';
import { useExpanded } from '~ui/shared/contexts/Expanded';

import Header from '../shared/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  hideButton?: boolean;
}

const Layout = ({ children, hideButton }: LayoutProps) => {
  return (
    <Container>
      <Header
        actionButton={
          !hideButton && {
            name: 'Start Session',
            // TODO: Implement session start handler
            onClick: () => console.info('Start session')
          }
        }
      />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  background: ${token('colors.background')};
  transition: all 0.2s ease-in-out;
  width: 350px;
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
