import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Flex,
  Icon,
  type IconProps,
  Image,
  ListItem,
  Menu,
  MenuItem,
  Text,
  token
} from '@synq/ui';
import { useEffect, useRef, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { MarqueeText } from '../MarqueeText';

interface QueueItemProps {
  active: boolean;
  albumCoverUrl: string;
  albumName: string;
  artistName: string;
  onClick: () => void;
  secondaryActions: {
    iconName: IconProps['icon'];
    text: string;
    onClick: () => void;
  }[];
  trackName: string;
}

export const QueueItem = ({
  active,
  albumCoverUrl,
  albumName,
  artistName,
  onClick,
  secondaryActions,
  trackName
}: QueueItemProps) => {
  const theme = useTheme();
  const iconRef = useRef<HTMLButtonElement>(null);
  const listItemRef = useRef<HTMLDivElement>(null);
  const [showSecondaryActions, setShowSecondaryActions] = useState(false);

  // Scroll item into view if it is active
  useEffect(() => {
    if (active) {
      listItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [active]);

  // Close secondary actions menu when scrolling
  useEffect(() => {
    if (!showSecondaryActions) {
      return;
    }

    const handleScroll = () => {
      setShowSecondaryActions(false);
    };

    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [showSecondaryActions]);

  const handleSecondaryActionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSecondaryActions(!showSecondaryActions);
  };

  const handleSecondaryActionClick = (onActionClick: () => void) => {
    setShowSecondaryActions(false);
    onActionClick();
  };

  const renderSecondaryAction = () => (
    <>
      <SecondaryActionMenuButton
        ref={iconRef}
        onClick={handleSecondaryActionButtonClick}
        $active={showSecondaryActions}
      >
        <FontAwesomeIcon
          icon={faEllipsisV}
          size="lg"
          color={theme.colors.onBackground}
        />
      </SecondaryActionMenuButton>
      <SecondaryActionMenu
        open={showSecondaryActions}
        onClose={() => setShowSecondaryActions(false)}
        anchorEl={iconRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        anchorPosition={{
          y: 8
        }}
      >
        {secondaryActions.map((action) => (
          <MenuItem
            key={action.text}
            onClick={() => handleSecondaryActionClick(action.onClick)}
            leftIcon={
              <SecondaryActionMenuItemIcon
                height="16px"
                width="16px"
                icon={action.iconName}
                color={theme.colors.onBackgroundMedium}
              />
            }
          >
            <Text type="subtitle" size="sm">
              {action.text}
            </Text>
          </MenuItem>
        ))}
      </SecondaryActionMenu>
    </>
  );

  return (
    <QueueItemContainer
      leftNode={
        <AlbumArtContainer>
          <AlbumArt
            $active={active}
            alt={`Album art for ${trackName}`}
            height="100%"
            radius="lg"
            src={albumCoverUrl}
            width="100%"
          />
          {active && (
            <AlbumArtOverlayFlex align="center" justify="center">
              <Icon icon="volume" color={theme.colors.onBackground} />
            </AlbumArtOverlayFlex>
          )}
        </AlbumArtContainer>
      }
      $active={active}
      onClick={onClick}
      ref={listItemRef}
      rightNode={renderSecondaryAction()}
    >
      <QueueItemTitle type="display" size="sm">
        {trackName}
      </QueueItemTitle>
      <QueueItemArtist type="body" size="xs">
        {artistName} • {albumName}
      </QueueItemArtist>
    </QueueItemContainer>
  );
};

interface QueueItemContainerProps {
  $active: boolean;
}

const QueueItemContainer = styled(ListItem)<QueueItemContainerProps>`
  padding: ${token('spacing.xs')} ${token('spacing.lg')};
  padding-right: ${token('spacing.2xs')};

  &:hover {
    background: ${token('colors.surface01')};
  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${token('colors.surface01')};
    `}
`;

const QueueItemTitle = styled(MarqueeText)`
  font-weight: ${token('typography.fontWeights.bold')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;

const QueueItemArtist = styled(MarqueeText)`
  color: ${token('colors.onBackgroundMedium')};
  margin-top: ${token('spacing.2xs')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;

const SecondaryActionMenu = styled(Menu)`
  background: ${token('colors.surface02')};
`;

interface SecondaryActionMenuButtonProps {
  $active: boolean;
}

const SecondaryActionMenuButton = styled.button<SecondaryActionMenuButtonProps>`
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

const SecondaryActionMenuItemIcon = styled(Icon)`
  margin-top: ${token('spacing.2xs')};
`;

interface AlbumArtProps {
  $active: boolean;
}

const AlbumArtContainer = styled.div`
  border-radius: ${token('radii.lg')};
  height: 60px;
  overflow: hidden;
  position: relative;
  width: 60px;
`;

const AlbumArt = styled(Image)<AlbumArtProps>`
  height: 100%;
  position: absolute;
  width: 100%;

  ${({ $active }) =>
    $active &&
    css`
      filter: brightness(0.6);
    `}
`;

const AlbumArtOverlayFlex = styled(Flex)`
  height: 100%;
  position: absolute;
  width: 100%;
`;
