import { Flex, token } from '@synqapp/ui';
import styled from 'styled-components';

import { AlbumArt } from '../../../shared/components/AlbumArt';
import { PlayerControls } from '../PlayerControls';

export const Player = () => {
  return (
    <Flex direction="row" justify="space-between" align="center">
      <AlbumArtContainer>
        <AlbumArt thumbs />
      </AlbumArtContainer>
      <PlayerControlsContainer>
        <PlayerControls />
      </PlayerControlsContainer>
    </Flex>
  );
};

const AlbumArtContainer = styled.div`
  height: 105px;
  max-height: 105px;
  max-width: 105px;
  min-height: 105px;
  min-width: 105px;
  width: 105px;

  margin: 0 auto;
`;

const PlayerControlsContainer = styled.div`
  height: fit-content;
  margin-left: ${token('spacing.sm')};
  margin-top: ${token('spacing.none')};
  width: calc(100% - 105px - ${token('spacing.sm')});
`;
