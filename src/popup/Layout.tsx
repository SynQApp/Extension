import { styled } from 'styled-components';

import Header from './components/Header';

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
  height: 420px;
`;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;

export default Layout;
