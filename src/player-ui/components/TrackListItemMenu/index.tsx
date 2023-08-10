import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Icon,
  type IconProps,
  Menu,
  MenuItem,
  type MenuProps,
  Text,
  token
} from '@synq/ui';
import { useEffect, useRef, useState } from 'react';
import { css, styled, useTheme } from 'styled-components';

interface TrackListItemMenuItem {
  icon: IconProps['icon'];
  onClick: () => void;
  text: string;
}

interface TrackListItemMenuProps {
  menuItems: TrackListItemMenuItem[];
  portalContainer?: MenuProps['portalContainer'];
}

export const TrackListItemMenu = ({
  menuItems,
  portalContainer
}: TrackListItemMenuProps) => {
  const theme = useTheme();
  const iconRef = useRef<HTMLButtonElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Close secondary actions menu when scrolling
  useEffect(() => {
    if (!showMenu || !portalContainer) {
      return;
    }

    const handleScroll = () => {
      setShowMenu(false);
    };

    portalContainer.addEventListener('scroll', handleScroll, true);

    return () => {
      portalContainer.removeEventListener('scroll', handleScroll);
    };
  }, [showMenu]);

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (onActionClick: () => void) => {
    setShowMenu(false);
    onActionClick();
  };

  return (
    <>
      <MenuButton
        ref={iconRef}
        onClick={handleMenuButtonClick}
        $active={showMenu}
      >
        <FontAwesomeIcon
          icon={faEllipsisV}
          height="16px"
          color={theme.colors.onBackground}
        />
      </MenuButton>
      <MenuStyled
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchorEl={iconRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        anchorPosition={{
          y: 8
        }}
        portalContainer={portalContainer}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleMenuItemClick(item.onClick)}
            leftIcon={
              <Icon
                height="16px"
                width="16px"
                icon={item.icon}
                color={theme.colors.onBackgroundMedium}
              />
            }
          >
            <Text type="subtitle" size="sm">
              {item.text}
            </Text>
          </MenuItem>
        ))}
      </MenuStyled>
    </>
  );
};

const MenuStyled = styled(Menu)`
  background: ${token('colors.surface02')};
`;

interface SecondaryActionMenuButtonProps {
  $active: boolean;
}

const MenuButton = styled.button<SecondaryActionMenuButtonProps>`
  align-items: center;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  height: 35px;
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: background-color 0.2s ease-in-out;
  width: 35px;

  &:hover {
    background-color: ${token('colors.surface02')};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${token('colors.surface02')};
    `}
`;
