import { Flex, token } from '@synq/ui';
import styled, { css } from 'styled-components';

import type { Expandable } from '~player-ui/types';
import { expandedStyle } from '~player-ui/util/expandedStyle';

import { AlbumArt } from '../AlbumArt';
import { PlayerControls } from '../PlayerControls';
import { usePlayer } from './usePlayer';

export const Player = () => {
  const { expanded, currentTrack, handleDislikeClick, handleLikeClick } =
    usePlayer();

  return (
    <Flex
      direction={expanded ? 'column' : 'row'}
      justify={expanded ? 'flex-start' : 'space-between'}
      align="center"
    >
      <AlbumArtContainer $expanded={expanded}>
        <AlbumArt
          liked={currentTrack?.isLiked}
          disliked={currentTrack?.isDisliked}
          onLikeClick={handleLikeClick}
          onDislikeClick={handleDislikeClick}
          trackName={currentTrack?.name}
          src={currentTrack?.albumCoverUrl}
        />
      </AlbumArtContainer>
      <PlayerControlsContainer $expanded={expanded}>
        <PlayerControls />
      </PlayerControlsContainer>
    </Flex>
  );
};

const AlbumArtContainer = styled.div<Expandable>`
  height: 105px;
  max-height: 105px;
  max-width: 105px;
  min-height: 105px;
  min-width: 105px;
  width: 105px;

  ${expandedStyle(
    css`
      height: 170px;
      max-height: initial;
      max-width: initial;
      min-height: initial;
      min-width: initial;
      width: 170px;
    `
  )}

  margin: 0 auto;
`;

const PlayerControlsContainer = styled.div<Expandable>`
  margin-left: ${token('spacing.sm')};
  margin-top: ${token('spacing.none')};
  width: calc(100% - 105px - ${token('spacing.sm')});

  ${expandedStyle(
    css`
      margin-left: ${token('spacing.none')};
      margin-top: ${token('spacing.md')};
      width: 100%;
    `
  )}
`;
