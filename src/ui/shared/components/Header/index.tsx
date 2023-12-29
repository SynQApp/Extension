import { Button, Flex, token } from '@synq/ui';
import { Icon } from '@synq/ui';
import styled from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import Logo from '../Logo';

interface HeaderProps {
  actionButton?: {
    name: string;
    onClick: () => void;
  };
}

const Header = ({ actionButton }: HeaderProps) => {
  const handleSettingsClick = () => {
    sendToBackground({
      name: 'OPEN_OPTIONS_PAGE'
    });
  };

  return (
    <HeaderStyled>
      <Flex align="center">
        <Logo size="controller" />
        <Flex align="center" justify="flex-end">
          {actionButton && (
            <SessionButton size="small" rounded onClick={actionButton.onClick}>
              {actionButton.name}
            </SessionButton>
          )}
          <SettingsButton onClick={handleSettingsClick} variant="tertiary">
            <SettingsIcon icon="settings" />
          </SettingsButton>
        </Flex>
      </Flex>
    </HeaderStyled>
  );
};

const HeaderStyled = styled.header`
  background: ${token('colors.background')};
  height: 40px;
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

const SettingsButton = styled(Button)`
  align-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  padding: 0;
  width: fit-content;
`;

const SettingsIcon = styled(Icon)`
  color: white;
  width: 24px;
  height: 24px;
`;

export default Header;
