import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Image, Stack, token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { useExpanded } from '~popup/contexts/Expanded';
import type { Expandable } from '~popup/types';
import { expandedStyle } from '~popup/util/expandedStyle';

interface AlbumArtProps {
  disliked: boolean;
  liked: boolean;
  onDislikeClick?: () => void;
  onLikeClick?: () => void;
  src: string;
  trackName: string;
}

export const AlbumArt = ({
  disliked,
  liked,
  onDislikeClick,
  onLikeClick,
  src,
  trackName
}: AlbumArtProps) => {
  const { expanded } = useExpanded();

  return (
    <AlbumArtContainer justify="center" align="center">
      <AlbumGlow className="album-glow" src={src} $expanded={expanded} />
      <AlbumArtImg src={src} alt={`Album art for: ${trackName}`} />
      <ThumbsOverlay className="thumbs-overlay" />
      <ThumbsContainer
        className="thumbs"
        align="center"
        justify="center"
        spacing="sm"
      >
        {onLikeClick && (
          <>
            <ThumbButton onClick={onLikeClick}>
              <ThumbIcon icon={liked ? faThumbsUpSolid : faThumbsUp} />
            </ThumbButton>
            {onDislikeClick && (
              <>
                <Line />
                <ThumbButton onClick={onDislikeClick}>
                  <ThumbIcon
                    icon={disliked ? faThumbsDownSolid : faThumbsDown}
                  />
                </ThumbButton>
              </>
            )}
          </>
        )}
      </ThumbsContainer>
    </AlbumArtContainer>
  );
};

const AlbumArtContainer = styled(Flex)`
  height: 100%;
  position: relative;
  width: 100%;

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

interface AlbumGlowProps extends Expandable {
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

  ${expandedStyle(css`
    filter: blur(10px);
  `)}
`;

const AlbumArtImg = styled(Image)`
  border-radius: ${token('radii.lg')};
  border: 1px solid ${token('colors.onBackground')}24;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
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
