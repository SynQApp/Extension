import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Image, Stack, token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { useAlbumArt } from './useAlbumArt';

interface AlbumArtProps {
  height?: string;
  thumbs?: boolean;
  width?: string;
}

export const AlbumArt = ({ height, thumbs, width }: AlbumArtProps) => {
  const {
    src,
    isLiked,
    isDisliked,
    trackName,
    handleLikeClick,
    handleDislikeClick
  } = useAlbumArt();

  return (
    <Container justify="center" align="center" $height={height} $width={width}>
      <AlbumGlow className="album-glow" src={src} />
      <AlbumArtImg
        src={src ?? ''}
        alt={`Album art for: ${trackName}`}
        fallback={<AlbumArtFallback />}
      />
      <ThumbsOverlay className="thumbs-overlay" />
      <ThumbsContainer
        className="thumbs"
        align="center"
        justify="center"
        spacing="sm"
      >
        {thumbs && handleLikeClick && (
          <>
            <ThumbButton onClick={handleLikeClick}>
              <ThumbIcon icon={isLiked ? faThumbsUpSolid : faThumbsUp} />
            </ThumbButton>
            {handleDislikeClick && (
              <>
                <Line />
                <ThumbButton onClick={handleDislikeClick}>
                  <ThumbIcon
                    icon={isDisliked ? faThumbsDownSolid : faThumbsDown}
                  />
                </ThumbButton>
              </>
            )}
          </>
        )}
      </ThumbsContainer>
    </Container>
  );
};

interface ContainerProps {
  $height?: string;
  $width?: string;
}

const Container = styled(Flex)<ContainerProps>`
  position: relative;
  ${({ $height }: ContainerProps) =>
    $height &&
    css`
      height: ${$height};
    `}
  ${({ $width }: ContainerProps) =>
    $width &&
    css`
      width: ${$width};
    `}

  &:hover {
    .thumbs-overlay {
      opacity: 0.5;
    }

    .thumbs {
      opacity: 1;
    }

    .album-glow {
      filter: blur(0px);
      transform: scale(1);
    }
  }
`;

interface AlbumGlowProps {
  src?: string;
}

const AlbumGlow = styled.div<AlbumGlowProps>`
  background: ${(props) =>
    props.src ? `url(${props.src})` : token('colors.surface01')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: ${token('radii.lg')};
  filter: blur(5px);
  height: 100%;
  position: absolute;
  transform: scale(1.01);
  width: 100%;
  z-index: 0;
  transition: filter 0.2s ease-in-out, transform 0.2s ease-in-out;
`;

const AlbumArtImg = styled(Image)`
  border-radius: ${token('radii.lg')};
  border: 1px solid ${token('colors.onBackground')}24;
  color: transparent;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
`;

const AlbumArtFallback = styled.div`
  background: ${token('colors.surface01')};
  border-radius: ${token('radii.lg')};
  border: 1px solid ${token('colors.onBackground')}24;
  height: 100%;
  width: 100%;
`;

const ThumbsOverlay = styled.div`
  background: ${token('colors.base.black')};
  border-radius: ${token('radii.lg')};
  height: 100%;
  opacity: 0;
  position: absolute;
  width: 100%;
  z-index: 2;
  transition: opacity 0.2s ease-in-out;
`;

const ThumbsContainer = styled(Stack)`
  height: 100%;
  opacity: 0;
  position: absolute;
  transition: opacity 0.2s ease-in-out;
  width: calc(100% - ${token('spacing.md')});
  z-index: 3;
  transform: rotate(45deg);
`;

const ThumbButton = styled.button`
  align-items: center;
  background: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  height: 35px;
  outline: none;
  justify-content: center;
  width: 35px;
`;

const ThumbIcon = styled(FontAwesomeIcon)`
  color: ${token('colors.onBackground')};
  width: 30px;
  height: 30px;
  transform: rotate(-45deg);
`;

const Line = styled.div`
  background: ${token('colors.onBackgroundLow')};
  height: 100%;
  min-width: 1px;
`;
