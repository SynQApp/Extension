import { Text, token } from '@synq/ui';
import Icon from 'data-base64:~assets/images/icon-filled.svg';
import styled from 'styled-components';

const Logo = () => {
  return (
    <Container>
      <LogoImage src={Icon} alt="SynQ Logo" />
      <LogoText type="display" size="xl" forwardedAs="h1">
        SynQ
      </LogoText>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: inline-flex;
`;

const LogoImage = styled.img`
  height: 50px;
  width: 50px;
`;

const LogoText = styled(Text)`
  font-weight: ${token('typography.fontWeights.medium')};
`;

export default Logo;
