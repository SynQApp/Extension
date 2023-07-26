import { token } from '@synq/ui';
import { css, styled } from 'styled-components';

import Header from './components/Header';
import { useExpanded } from './contexts/Expanded';
import { type Expandable } from './types';
import { expandedStyle } from './util/expandedStyle';

const Layout = ({ children }) => {
  const { expanded } = useExpanded();

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
  width: 330px;
  height: 190px;

  ${expandedStyle(css`
    width: 290px;
    height: 400px;
  `)}
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
