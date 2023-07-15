import { Button, token } from '@synq/ui';
import styled from 'styled-components';

import Logo from '../Logo';

const Header = () => {
  return (
    <HeaderStyled>
      <Logo />
      <SettingsButton variant="tertiary">⚙</SettingsButton>
    </HeaderStyled>
  );
};

const HeaderStyled = styled.header`
  background: ${token('colors.background')};
  display: flex;
  padding: 0 ${token('spacing.md')} 0 ${token('spacing.sm')};
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid ${token('colors.borderLow')};
`;

const SettingsButton = styled(Button)`
  font-size: ${token('typography.fontSizes.h2')};
  padding: 0;
  margin: 0;
`;

export default Header;
