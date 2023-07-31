import { Flex, token } from '@synq/ui';
import { Icon } from '@synq/ui';
import styled from 'styled-components';

import Logo from '../Logo';

const Header = () => {
  return (
    <HeaderStyled>
      <Flex align="center">
        <Logo />
        <SettingsIcon icon="settings" />
      </Flex>
    </HeaderStyled>
  );
};

const HeaderStyled = styled.header`
  background: ${token('colors.background')};
  height: 50px;
  padding: 0 ${token('spacing.sm')} 0;
`;

const SettingsIcon = styled(Icon)`
  color: white;
  width: 24px;
  height: 24px;
`;

export default Header;
