import { styled } from 'styled-components';

interface ScreenProps {
  children: React.ReactNode;
}

export const Screen = ({ children }: ScreenProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
  margin: auto;
`;
