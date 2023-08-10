import { Button, Flex, token } from '@synq/ui';
import { Icon } from '@synq/ui';
import styled, { css } from 'styled-components';

import Logo from '../Logo';

interface HeaderProps {
  actionButton?: {
    name: string;
    onClick: () => void;
  };
}

const Header = ({ actionButton }: HeaderProps) => {
  return (
    <HeaderStyled>
      <Flex align="center">
        <Logo />
        <Flex align="center" justify="flex-end">
          {actionButton && (
            <SessionButton size="small" rounded onClick={actionButton.onClick}>
              {actionButton.name}
            </SessionButton>
          )}
          <SettingsIcon icon="settings" />
        </Flex>
      </Flex>
    </HeaderStyled>
  );
};

const HeaderStyled = styled.header`
  background: ${token('colors.background')};
  height: 50px;
  padding: ${token('spacing.xs')} ${token('spacing.sm')} 0;
`;

const SessionButton = styled(Button)`
  font-family: ${token('typography.fontFamilies.body')};
  font-size: ${token('typography.fontSizes.sm')};
  height: 30px;
  line-height: ${token('spacing.none')};
  margin-right: ${token('spacing.md')};
  padding: ${token('spacing.3xs')} ${token('spacing.sm')};

  &::before {
    display: none;
  }
`;

const SettingsIcon = styled(Icon)`
  color: white;
  width: 24px;
  height: 24px;
`;

export default Header;
