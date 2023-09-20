import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Stack, token } from '@synq/ui';
import { styled } from 'styled-components';

import { AlbumArt } from '~ui/shared/components/AlbumArt';
import { ArtistName } from '~ui/shared/components/ArtistName';
import { NextButton } from '~ui/shared/components/NextButton';
import { PlayPauseButton } from '~ui/shared/components/PlayPauseButton';
import { PreviousButton } from '~ui/shared/components/PreviousButton';
import { RepeatButton } from '~ui/shared/components/RepeatButton';
import { ShuffleButton } from '~ui/shared/components/ShuffleButton';
import { TrackSeeker } from '~ui/shared/components/TrackSeeker';
import { TrackTitle } from '~ui/shared/components/TrackTitle';
import { VolumeButton } from '~ui/shared/components/VolumeButton';
import { VolumeSlider } from '~ui/shared/components/VolumeSlider';

export const PlayerBar = () => {
  return (
    <Container direction="row" align="center">
      <PlayerBarSection>
        <Stack direction="row" align="center" spacing="md">
          <AlbumArtContainer>
            <AlbumArt height="60px" width="60px" />
          </AlbumArtContainer>
          <TrackInfoContainer direction="column" spacing="none">
            <TrackTitle size="md" weight="bold" />
            <ArtistName size="sm" />
          </TrackInfoContainer>
        </Stack>
      </PlayerBarSection>
      <PlayerBarSection>
        <Stack direction="column" align="center" spacing="sm">
          <Stack direction="row" spacing="lg" align="center">
            <ShuffleButton size={32} />
            <PreviousButton size={36} />
            <PlayPauseButton size={44} />
            <NextButton size={36} />
            <RepeatButton size={32} />
          </Stack>
          <TrackSeeker width={350} inline />
        </Stack>
      </PlayerBarSection>
      <PlayerBarSection>
        <Stack direction="row" align="center" spacing="xl" justify="flex-end">
          <Stack align="center" direction="row" spacing="xs">
            <VolumeButton size={36} />
            <VolumeSlider width="150px" />
          </Stack>
          <FontAwesomeIcon
            icon={faChevronUp}
            width={20}
            height={20}
            color={'white'}
          />
        </Stack>
      </PlayerBarSection>
    </Container>
  );
};

const Container = styled(Flex)`
  background: ${token('colors.background')};
  height: 120px;
  width: 100vw;
  position: fixed;
  bottom: 0;
  padding: 0 ${token('spacing.xl')};
`;

const AlbumArtContainer = styled.div`
  height: 60px;
  width: 60px;
  flex-shrink: 0;
`;

const TrackInfoContainer = styled(Stack)`
  overflow: auto;
`;

const PlayerBarSection = styled.div`
  flex: 1 1 0px;
  width: 33.33%;
  min-width: 33.33%;
  max-width: 33.33%;
`;
