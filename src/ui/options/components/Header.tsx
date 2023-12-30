import { token } from '@synq/ui';
import styled from 'styled-components';

import Logo from '~ui/shared/components/Logo';

export const Header = () => {
  return (
    <Container>
      <Logo size="page" />
    </Container>
  );
};

const Container = styled.header`
  margin: ${token('spacing.sm')} ${token('spacing.xl')};
`;
