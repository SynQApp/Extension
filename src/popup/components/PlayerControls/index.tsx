import { Text, token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { expandedStyle } from '~popup/util/expandedStyle';

import { ControlButtons } from '../ControlButtons';
import { TextShortenedMarquee } from '../MarqueeText';
import { TrackSeeker } from '../TrackSeeker';
import { usePlayerControls } from './usePlayerControls';

const MAX_TRACK_TITLE_COLLAPSED_LENGTH = 20;
const MAX_TRACK_TITLE_EXPANDED_LENGTH = 22;

const MAX_TRACK_ARTIST_COLLAPSED_LENGTH = 28;
const MAX_TRACK_ARTIST_EXPANDED_LENGTH = 35;

export const PlayerControls = () => {
  const {
    expanded,
    currentSongInfo,
    playbackState,
    handleTogglePausePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleToggleRepeat,
    handleChangeVolume
  } = usePlayerControls();

  return (
    <PlayerControlsContainer>
      <TrackTitle
        type="display"
        size={expanded ? 'xl' : 'md'}
        forwardedAs="h2"
        $expanded={expanded}
      >
        {currentSongInfo?.trackName}
      </TrackTitle>
      <TrackArtist
        type="body"
        size={expanded ? 'sm' : 'xs'}
        $expanded={expanded}
      >
        {currentSongInfo?.artistName}
      </TrackArtist>
      <TrackSeekerContainer>
        <TrackSeeker
          currentTime={playbackState?.currentTime}
          duration={currentSongInfo?.duration}
          onSeek={handleSeek}
        />
      </TrackSeekerContainer>
      <ControlButtonsContainer $expanded={expanded}>
        <ControlButtons
          isPlaying={playbackState?.isPlaying}
          volume={playbackState?.volume}
          repeatMode={playbackState?.repeatMode}
          onPausePlay={handleTogglePausePlay}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onRepeatModeChange={handleToggleRepeat}
          onVolumeChange={handleChangeVolume}
        />
      </ControlButtonsContainer>
    </PlayerControlsContainer>
  );
};

const PlayerControlsContainer = styled.div`
  width: 100%;
`;

interface Expandable {
  $expanded: boolean;
}

const TrackTitle = styled(TextShortenedMarquee)<Expandable>`
  margin: 0;
  font-weight: ${token('typography.fontWeights.semibold')};
`;

const TrackArtist = styled(TextShortenedMarquee)<Expandable>`
  margin: ${token('spacing.3xs')} 0 0;
  color: ${token('colors.onBackgroundMedium')};
  line-height: 14px;
  font-weight: ${token('typography.fontWeights.regular')};

  ${expandedStyle(
    css`
      font-weight: ${token('typography.fontWeights.thin')};
    `
  )};
`;

const TrackSeekerContainer = styled.div`
  margin-top: ${token('spacing.sm')};
`;

interface ControlButtonsContainerProps {
  $expanded: boolean;
}

const ControlButtonsContainer = styled.div<ControlButtonsContainerProps>`
  ${expandedStyle(
    css`
      margin-top: ${token('spacing.xs')};
    `
  )}
`;
