import { Image, Text, token } from '@synq/ui';
import SynQIcon from 'data-base64:~assets/images/icon-filled.svg';
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
