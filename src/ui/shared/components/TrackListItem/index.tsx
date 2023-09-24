import {
  Flex,
  Icon,
  type IconProps,
  Image,
  ListItem,
  Stack,
  token
} from '@synq/ui';
import { useEffect, useRef } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { MarqueeText } from '../MarqueeText';

interface TrackListItemProps {
  active?: boolean;
  className?: string;
  handleProps?: React.HTMLAttributes<HTMLDivElement>;
  imageIconOverlay?: IconProps['icon'];
  imageUrl: string;
  imageAlt: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText?: string;
  onClick?: () => void;
  onImageClick?: () => void;
  rightNode?: React.ReactNode;
}

export const TrackListItem = ({
  active,
  className,
  handleProps,
  imageIconOverlay,
  imageUrl,
  imageAlt,
  primaryText,
  onClick,
  onImageClick,
  secondaryText,
  tertiaryText,
  rightNode
}: TrackListItemProps) => {
  const theme = useTheme();
  const listItemRef = useRef<HTMLDivElement>(null);

  if (!active) {
    active = false;
  }

  // Scroll item into view if it is active
  useEffect(() => {
    if (active) {
      listItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [active]);

  return (
    <Container
      className={className}
      leftNode={
        <Stack align="center" spacing="xs">
          {handleProps && (
            <div {...handleProps}>
              <Icon icon="dragHandle" color={theme.colors.onBackground} />
            </div>
          )}
          <AlbumArtContainer onClick={onImageClick}>
            <ImageStyled
              $active={active}
              $hasOverlay={!!imageIconOverlay}
              alt={imageAlt}
              className="album-art"
              height="100%"
              radius="lg"
              src={imageUrl ?? ''}
              width="100%"
              fallback={
                <ImageFallbackFlex align="center" justify="center">
                  <Icon
                    icon="musicNote"
                    color={theme.colors.onBackgroundMedium}
                  />
                </ImageFallbackFlex>
              }
            />
            {imageIconOverlay && (
              <ImageOverlayFlex
                $active={active}
                align="center"
                className="album-art-overlay"
                justify="center"
              >
                <Icon
                  icon={imageIconOverlay}
                  color={theme.colors.onBackground}
                />
              </ImageOverlayFlex>
            )}
          </AlbumArtContainer>
        </Stack>
      }
      $active={active}
      $hasOverlay={!!imageIconOverlay}
      $hasHandle={!!handleProps}
      ref={listItemRef}
      rightNode={rightNode}
      onClick={onClick}
    >
      <PrimaryText type="display" size="sm" weight="semibold">
        {primaryText}
      </PrimaryText>
      <SecondaryText type="body" size="xs">
        {secondaryText}
      </SecondaryText>
      {tertiaryText && (
        <SecondaryText type="body" size="xs">
          {tertiaryText}
        </SecondaryText>
      )}
    </Container>
  );
};

interface ContainerProps {
  $active: boolean;
  $hasOverlay?: boolean;
  $hasHandle?: boolean;
}

const Container = styled(ListItem)<ContainerProps>`
  padding: ${token('spacing.xs')} ${token('spacing.lg')};
  padding-right: ${token('spacing.2xs')};
  height: unset;

  &:hover {
    background: ${token('colors.surface01')};

    ${({ $hasOverlay }) =>
      $hasOverlay &&
      css`
        .album-art-overlay {
          opacity: 1;
        }

        .album-art {
          filter: brightness(0.4);
        }
      `}
  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${token('colors.surface01')};
    `}

  ${({ $hasHandle }) =>
    $hasHandle &&
    css`
      padding-left: ${token('spacing.xs')};
    `}
`;

const PrimaryText = styled(MarqueeText)`
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;

const SecondaryText = styled(MarqueeText)`
  margin-top: ${token('spacing.2xs')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
    color: ${token('colors.onBackgroundMedium')};
  }
`;

const AlbumArtContainer = styled.div`
  border-radius: ${token('radii.lg')};
  height: 60px;
  overflow: hidden;
  position: relative;
  width: 60px;
  cursor: pointer;
`;

interface ImageStyledProps {
  $active: boolean;
  $hasOverlay?: boolean;
}

const ImageStyled = styled(Image)<ImageStyledProps>`
  height: 100%;
  position: absolute;
  width: 100%;
  transition: filter 0.2s ease-in-out;

  ${({ $active, $hasOverlay }) =>
    $active &&
    $hasOverlay &&
    css`
      filter: brightness(0.4);
    `}
`;

const ImageFallbackFlex = styled(Flex)`
  background: ${token('colors.surface02')};
`;

const ImageOverlayFlex = styled(Flex)<ImageStyledProps>`
  opacity: 0;
  height: 100%;
  position: absolute;
  width: 100%;
  transition: opacity 0.2s ease-in-out;

  ${({ $active }) =>
    $active &&
    css`
      opacity: 1;
    `}
`;
