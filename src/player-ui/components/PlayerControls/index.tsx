import { Text, token } from '@synq/ui';
import { css, styled } from 'styled-components';

import { expandedStyle } from '~player-ui/util/expandedStyle';

import { ControlButtons } from '../ControlButtons';
import { MarqueeText } from '../MarqueeText';
import { TrackSeeker } from '../TrackSeeker';
import { usePlayerControls } from './usePlayerControls';

export const PlayerControls = () => {
  const {
    expanded,
    currentTrack,
    playerState,
    handleTogglePausePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleToggleRepeat,
    handleChangeVolume,
    handleToggleMute
  } = usePlayerControls();

  return (
    <PlayerControlsContainer>
      <TrackTitle
        type="display"
        size={expanded ? 'xl' : 'md'}
        forwardedAs="h2"
        $expanded={expanded}
      >
        {currentTrack?.name ?? '-'}
      </TrackTitle>
      <TrackArtist
        type="body"
        size={expanded ? 'sm' : 'xs'}
        $expanded={expanded}
      >
        {currentTrack?.artistName ?? '-'}
      </TrackArtist>
      <TrackSeekerContainer>
        <TrackSeeker
          currentTime={playerState?.currentTime}
          duration={currentTrack?.duration}
          onSeek={handleSeek}
        />
      </TrackSeekerContainer>
      <ControlButtonsContainer $expanded={expanded}>
        <ControlButtons
          isPlaying={playerState?.isPlaying}
          volume={playerState?.volume}
          repeatMode={playerState?.repeatMode}
          onPausePlay={handleTogglePausePlay}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onRepeatModeChange={handleToggleRepeat}
          onVolumeChange={handleChangeVolume}
          onVolumeClick={handleToggleMute}
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

const TrackTitle = styled(MarqueeText)<Expandable>`
  .text {
    margin: 0;
    font-weight: ${token('typography.fontWeights.semibold')};
  }
`;

const TrackArtist = styled(MarqueeText)<Expandable>`
  .text {
    margin: ${token('spacing.3xs')} 0 0;
    color: ${token('colors.onBackgroundMedium')};
    line-height: 14px;
    font-weight: ${token('typography.fontWeights.regular')};

    ${expandedStyle(
      css`
        font-weight: ${token('typography.fontWeights.thin')};
      `
    )};
  }
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
