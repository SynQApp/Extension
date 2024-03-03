import { Flex, Stack, Text, token } from '@synqapp/ui';
import { Slider } from '@synqapp/ui';
import { css, styled } from 'styled-components';

import { secondsToLengthText } from '~util/time';

import { useTrackSeeker } from './useTrackSeeker';

interface TrackSeekerProps {
  width?: number;
  inline?: boolean;
  sliderThickness?: number;
}

export const TrackSeeker = ({
  width,
  inline,
  sliderThickness
}: TrackSeekerProps) => {
  const { currentTime, duration, handleSeek } = useTrackSeeker();

  const renderSeekSlider = () => {
    return (
      <SeekContainer $sliderThickness={sliderThickness} $width={width}>
        <Slider
          min={0}
          max={duration ?? 0}
          value={currentTime ?? 0}
          onChange={handleSeek}
        />
      </SeekContainer>
    );
  };

  const renderCurrentTime = () => {
    return (
      <TimeText type="body" size="xs" $inline={inline}>
        {secondsToLengthText(currentTime)}
      </TimeText>
    );
  };

  const renderDuration = () => {
    return (
      <TimeText type="body" size="xs" $inline={inline}>
        {secondsToLengthText(duration)}
      </TimeText>
    );
  };

  return inline ? (
    <Stack direction="row" spacing="xs" align="center">
      {renderCurrentTime()}
      {renderSeekSlider()}
      {renderDuration()}
    </Stack>
  ) : (
    <Stack direction="column" spacing="none">
      {renderSeekSlider()}
      <Flex justify="space-between">
        {renderCurrentTime()}
        {renderDuration()}
      </Flex>
    </Stack>
  );
};

interface SeekContainerProps {
  $width?: number;
  $sliderThickness?: number;
}

const SeekContainer = styled.div<SeekContainerProps>`
  height: 6px;
  width: 100%;
  position: relative;

  ${({ $width }) =>
    $width &&
    css`
      width: ${$width}px;
    `}

  ${({ $sliderThickness }) =>
    $sliderThickness &&
    css`
      height: ${$sliderThickness}px;
    `}
`;

interface TimeTextProps {
  $inline?: boolean;
}

const TimeText = styled(Text)<TimeTextProps>`
  margin: 0;

  ${({ $inline }) =>
    !$inline &&
    css`
      margin: ${token('spacing.2xs')} 0 0;
    `}
`;
