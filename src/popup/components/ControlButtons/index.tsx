import { Flex, token } from '@synq/ui';
import { useState } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { useExpanded } from '~popup/contexts/Expanded';
import type { Expandable } from '~popup/types';
import { expandedStyle } from '~popup/util/expandedStyle';
import { RepeatMode } from '~types/RepeatMode';

import { Slider } from '../GradientSlider';
import { SvgIcon } from '../SvgIcon';

interface ControlButtonsProps {
  isPlaying: boolean;
  onNext: () => void;
  onPausePlay: () => void;
  onPrevious: () => void;
  onRepeatModeChange: () => void;
  onVolumeChange: (volume: number) => void;
  repeatMode: RepeatMode;
  volume: number;
}

export const ControlButtons = ({
  isPlaying,
  onNext,
  onPausePlay,
  onPrevious,
  onRepeatModeChange,
  onVolumeChange,
  repeatMode,
  volume
}: ControlButtonsProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { expanded } = useExpanded();
  const theme = useTheme();

  const handleVolumeButtonClick = () => {
    if (volume === 0) {
      onVolumeChange(50);
    } else {
      onVolumeChange(0);
    }
  };

  const handleVolumeMouseEnter = () => {
    setShowVolumeSlider(true);
  };

  const handleVolumeMouseLeave = () => {
    setShowVolumeSlider(false);
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseInt(e.target.value));
  };

  return (
    <ControlButtonsContainer $expanded={expanded}>
      <ControlButtonsFlex justify="space-between" align="center">
        <ControlButton
          onClick={handleVolumeButtonClick}
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
          $expanded={expanded}
        >
          <ControlIcon
            icon={volume === 0 ? 'volumeMuted' : 'volume'}
            $expanded={expanded}
          />
        </ControlButton>
        <ControlButton
          onClick={onPrevious}
          $expanded={expanded}
          $hidden={showVolumeSlider}
        >
          <ControlIcon icon="previous" $expanded={expanded} />
        </ControlButton>
        <PlayPauseButton
          onClick={onPausePlay}
          $expanded={expanded}
          $hidden={showVolumeSlider}
        >
          <PlayPauseButtonGlow $expanded={expanded} className="glow" />
          <PlayPauseButtonContent>
            <PlayPauseIcon
              icon={isPlaying ? 'pause' : 'play'}
              $expanded={expanded}
            />
          </PlayPauseButtonContent>
        </PlayPauseButton>
        <ControlButton
          onClick={onNext}
          $expanded={expanded}
          $hidden={showVolumeSlider}
        >
          <ControlIcon icon="next" $expanded={expanded} />
        </ControlButton>
        <ControlButton
          onClick={onRepeatModeChange}
          $expanded={expanded}
          $hidden={showVolumeSlider}
        >
          <RepeatIcon
            icon={
              repeatMode === RepeatMode.REPEAT_ONE ? 'repeatOne' : 'repeatAll'
            }
            $expanded={expanded}
            $active={repeatMode !== RepeatMode.NO_REPEAT}
          />
        </ControlButton>
      </ControlButtonsFlex>
      <VolumeSliderContainer
        $show={showVolumeSlider}
        $expanded={expanded}
        onMouseEnter={handleVolumeMouseEnter}
        onMouseLeave={handleVolumeMouseLeave}
      >
        <VolumeSlider
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeSliderChange}
          $expanded={expanded}
          progressColor={theme.colors.onBackground}
        />
      </VolumeSliderContainer>
    </ControlButtonsContainer>
  );
};

const ControlButtonsContainer = styled.div<Expandable>`
  position: relative;
  height: 30px;

  ${expandedStyle(
    css`
      height: 40px;
    `
  )};
`;

const ControlButtonsFlex = styled(Flex)`
  position: absolute;
  z-index: 1;
`;

interface ControlButtonProps extends Expandable {
  $hidden?: boolean;
}

const ControlButton = styled.button<ControlButtonProps>`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 32px;
  width: 32px;
  opacity: 1;
  transition: opacity 0.1s ease-in-out;

  ${expandedStyle(
    css`
      height: 35px;
      width: 35px;
    `
  )};

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
    `}
`;

const ControlIcon = styled(SvgIcon)<Expandable>`
  color: ${token('colors.onBackground')};
  height: 20px;
  width: 20px;

  ${expandedStyle(
    css`
      height: 22px;
      width: 22px;
    `
  )};
`;

interface RepeatIconProps extends Expandable {
  $active: boolean;
}

const RepeatIcon = styled(ControlIcon)<RepeatIconProps>`
  color: ${(props) =>
    token(props.$active ? 'colors.base.orange.4' : 'colors.onBackground')(
      props
    )};
`;

const PlayPauseButton = styled.button<ControlButtonProps>`
  background: ${token('colors.gradient')};
  height: 30px;
  width: 30px;
  position: relative;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;

  ${expandedStyle(
    css`
      height: 40px;
      width: 40px;
    `
  )};

  &:hover {
    transform: scale(1.05);

    & > .glow {
      filter: blur(3px);
    }
  }

  &:active {
    transform: scale(1) translateY(1px);
    transition: none;

    & > .glow {
      transition: none;
      filter: blur(0px);
    }
  }

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
    `}
`;

const PlayPauseButtonGlow = styled.div<Expandable>`
  background: ${token('colors.gradient')};
  height: 30px;
  width: 30px;
  position: absolute;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transform: scale(1.05);
  top: 0;
  left: 0;
  opacity: 0.7;
  filter: blur(2px);
  transition: filter 0.1s ease-in-out;

  ${expandedStyle(
    css`
      height: 40px;
      width: 40px;
    `
  )};
`;

const PlayPauseButtonContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;

const PlayPauseIcon = styled(SvgIcon)<Expandable>`
  color: ${token('colors.onBackground')};
  fill: ${token('colors.onBackground')};
  width: 18px;
  height: 18px;

  ${expandedStyle(
    css`
      height: 22px;
      width: 22px;
    `
  )};
`;

interface VolumeSliderContainerProps extends Expandable {
  $show?: boolean;
}

const VolumeSliderContainer = styled.div<VolumeSliderContainerProps>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  position: absolute;
  z-index: 0;
  width: 80%;
  right: 0;
  padding-left: 10px;

  ${({ $show }) =>
    $show &&
    css`
      opacity: 1;
      z-index: 1;
    `}

  ${expandedStyle(
    css`
      width: 85%;
    `
  )};
`;

const VolumeSlider = styled(Slider)<Expandable>`
  height: 6px;
  width: 100%;
`;
