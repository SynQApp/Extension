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
  border-bottom: 1px solid ${token('colors.borderLow')};
  display: flex;
  height: 50px;
  justify-content: space-between;
  padding: 0 ${token('spacing.md')} 0 ${token('spacing.sm')};
`;

const SettingsButton = styled(Button)`
  font-size: ${token('typography.fontSizes.2xl')};
  margin: 0;
  padding: 0;
`;

export default Header;
