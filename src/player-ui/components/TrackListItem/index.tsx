import { Flex, Icon, type IconProps, Image, ListItem, token } from '@synq/ui';
import { useEffect, useRef } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { MarqueeText } from '../MarqueeText';

interface TrackListItemProps {
  active?: boolean;
  imageIconOverlay?: IconProps['icon'];
  imageUrl: string;
  imageAlt: string;
  primaryText: string;
  secondaryText: string;
  onClick: () => void;
  rightNode?: React.ReactNode;
}

export const TrackListItem = ({
  active,
  imageIconOverlay,
  imageUrl,
  imageAlt,
  primaryText,
  onClick,
  secondaryText,
  rightNode
}: TrackListItemProps) => {
  const theme = useTheme();
  const listItemRef = useRef<HTMLDivElement>(null);

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
      leftNode={
        <AlbumArtContainer onClick={onClick}>
          <ImageStyled
            $active={active}
            alt={imageAlt}
            className="album-art"
            height="100%"
            radius="lg"
            src={imageUrl}
            width="100%"
          />
          {imageIconOverlay && (
            <ImageOverlayFlex
              $active={active}
              align="center"
              className="album-art-overlay"
              justify="center"
            >
              <Icon icon={imageIconOverlay} color={theme.colors.onBackground} />
            </ImageOverlayFlex>
          )}
        </AlbumArtContainer>
      }
      $active={active}
      ref={listItemRef}
      rightNode={rightNode}
    >
      <PrimaryText type="display" size="sm">
        {primaryText}
      </PrimaryText>
      <SecondaryText type="body" size="xs">
        {secondaryText}
      </SecondaryText>
    </Container>
  );
};

interface ContainerProps {
  $active: boolean;
}

const Container = styled(ListItem)<ContainerProps>`
  padding: ${token('spacing.xs')} ${token('spacing.lg')};
  padding-right: ${token('spacing.2xs')};

  &:hover {
    background: ${token('colors.surface01')};

    .album-art-overlay {
      opacity: 1;
    }

    .album-art {
      filter: brightness(0.4);
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${token('colors.surface01')};
    `}
`;

const PrimaryText = styled(MarqueeText)`
  font-weight: ${token('typography.fontWeights.bold')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
  }
`;

const SecondaryText = styled(MarqueeText)`
  color: ${token('colors.onBackgroundMedium')};
  margin-top: ${token('spacing.2xs')};
  height: 100%;
  width: 100%;

  .text {
    margin: 0;
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
}

const ImageStyled = styled(Image)<ImageStyledProps>`
  height: 100%;
  position: absolute;
  width: 100%;
  transition: filter 0.2s ease-in-out;

  ${({ $active }) =>
    $active &&
    css`
      filter: brightness(0.4);
    `}
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
