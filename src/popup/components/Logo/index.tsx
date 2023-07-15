import { Text, token } from '@synq/ui';
import Icon from 'data-base64:~assets/images/icon-filled.svg';
import styled from 'styled-components';

const Logo = () => {
  return (
    <Container>
      <LogoImage src={Icon} alt="SynQ Logo" />
      <LogoText variant="h1">SynQ</LogoText>
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
`;

const LogoText = styled(Text)`
  font-size: ${token('typography.fontSizes.h2')};
  font-weight: ${token('typography.fontWeights.medium')};
`;

export default Logo;
