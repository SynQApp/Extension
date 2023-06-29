import styled from 'styled-components';

import Header from './components/Header';

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <div>{children}</div>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  width: 300px;
  height: 400px;
  overflow-y: scroll;
`;
