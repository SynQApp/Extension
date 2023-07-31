import { token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { useExpanded } from '~popup/contexts/Expanded';
import type { Expandable } from '~popup/types';
import { expandedStyle } from '~popup/util/expandedStyle';

interface AlbumArtProps {
  src: string;
}

export const AlbumArt = ({ src }: AlbumArtProps) => {
  const { expanded } = useExpanded();

  return (
    <AlbumArtContainer>
      <AlbumGlow src={src} $expanded={expanded} />
      <AlbumArtImg src={src} />
    </AlbumArtContainer>
  );
};

const AlbumArtContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

interface AlbumGlowProps extends Expandable {
  src?: string;
}

const AlbumGlow = styled.div<AlbumGlowProps>`
  background: ${(props) =>
    props.src ? `url(${props.src})` : 'linear-gradient(#424242, #333333)'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain !important;
  border-radius: 10px;
  filter: blur(5px);
  height: 100%;
  position: absolute;
  transform: scale(1.01);
  width: 100%;

  ${expandedStyle(css`
    filter: blur(10px);
  `)}
`;

const AlbumArtImg = styled.img`
  border-radius: ${token('radii.lg')};
  border: 1px solid ${token('colors.onBackground')}24;
  height: 100%;
  position: absolute;
  width: 100%;
`;
