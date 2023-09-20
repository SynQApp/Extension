import { token } from '@synq/ui';
import { styled } from 'styled-components';

import { ArtistName } from '~/ui/shared/components/ArtistName';
import { TrackTitle } from '~/ui/shared/components/TrackTitle';
import { TrackSeeker } from '~ui/shared/components/TrackSeeker';

import { ControlButtons } from '../ControlButtons';

export const PlayerControls = () => {
  return (
    <PlayerControlsContainer>
      <TrackTitle size="md" weight="semibold" />
      <ArtistName size="xs" />
      <TrackSeekerContainer>
        <TrackSeeker />
      </TrackSeekerContainer>
      <div>
        <ControlButtons />
      </div>
    </PlayerControlsContainer>
  );
};

const PlayerControlsContainer = styled.div`
  width: 100%;
`;

const TrackSeekerContainer = styled.div`
  margin-top: ${token('spacing.sm')};
`;
