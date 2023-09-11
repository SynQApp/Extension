import { Flex, Text, token } from '@synq/ui';
import { Slider } from '@synq/ui';
import { useMemo } from 'react';
import { styled, useTheme } from 'styled-components';

import { secondsToLengthText } from '~util/time';

interface TrackSeekerProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const TrackSeeker = ({
  currentTime,
  duration,
  onSeek
}: TrackSeekerProps) => {
  const theme = useTheme();
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseInt(e.target.value));
  };

  return (
    <>
      <SeekContainer>
        <Slider
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
        />
      </SeekContainer>
      <Flex justify="space-between">
        <TimeText type="body" size="xs">
          {secondsToLengthText(currentTime)}
        </TimeText>
        <TimeText type="body" size="xs">
          {secondsToLengthText(duration)}
        </TimeText>
      </Flex>
    </>
  );
};

const SeekContainer = styled.div`
  height: 6px;
  width: 100%;
  position: relative;
`;

const TimeText = styled(Text)`
  margin: ${token('spacing.2xs')} 0 0;
`;
