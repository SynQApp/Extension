import { Flex, token } from '@synq/ui';
import { useState } from 'react';
import styled, { css } from 'styled-components';

import { NextButton } from '~ui/shared/components/NextButton';
import { PlayPauseButton } from '~ui/shared/components/PlayPauseButton';
import { PreviousButton } from '~ui/shared/components/PreviousButton';
import { RepeatButton } from '~ui/shared/components/RepeatButton';
import { VolumeButton } from '~ui/shared/components/VolumeButton';
import { VolumeSlider } from '~ui/shared/components/VolumeSlider';

export const ControlButtons = () => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeMouseEnter = () => {
    setShowVolumeSlider(true);
  };

  const handleVolumeMouseLeave = () => {
    setShowVolumeSlider(false);
  };

  return (
    <ControlButtonsContainer>
      <ControlButtonsFlex justify="space-between" align="center">
        <div
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
        >
          <VolumeButton />
        </div>
        <HideableButtonContainer $hidden={showVolumeSlider}>
          <PreviousButton />
        </HideableButtonContainer>
        <HideableButtonContainer $hidden={showVolumeSlider}>
          <PlayPauseButton />
        </HideableButtonContainer>
        <HideableButtonContainer $hidden={showVolumeSlider}>
          <NextButton />
        </HideableButtonContainer>
        <HideableButtonContainer $hidden={showVolumeSlider}>
          <RepeatButton />
        </HideableButtonContainer>
      </ControlButtonsFlex>
      <VolumeSliderContainer
        justify="flex-end"
        align="center"
        $show={showVolumeSlider}
        onMouseEnter={handleVolumeMouseEnter}
        onMouseLeave={handleVolumeMouseLeave}
      >
        <VolumeSlider />
      </VolumeSliderContainer>
    </ControlButtonsContainer>
  );
};

const ControlButtonsContainer = styled.div`
  position: relative;
  height: 30px;
`;

const ControlButtonsFlex = styled(Flex)`
  position: absolute;
  z-index: 1;
`;

interface HideableButtonContainerProps {
  $hidden?: boolean;
}

const HideableButtonContainer = styled.div<HideableButtonContainerProps>`
  opacity: 1;

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
    `}
`;

interface VolumeSliderContainerProps {
  $show?: boolean;
}

const VolumeSliderContainer = styled(Flex)<VolumeSliderContainerProps>`
  height: 100%;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  position: absolute;
  z-index: 0;
  width: 85%;
  right: ${token('spacing.2xs')};
  padding-left: ${token('spacing.xs')};

  ${({ $show }) =>
    $show &&
    css`
      opacity: 1;
      z-index: 1;
    `}
`;
