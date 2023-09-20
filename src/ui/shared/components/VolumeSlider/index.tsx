import { Slider } from '@synq/ui';
import { css, styled } from 'styled-components';

import { useVolumeSlider } from './useVolumeSlider';

interface VolumeSliderProps {
  sliderThickness?: number;
  width?: string | number;
}

export const VolumeSlider = ({ sliderThickness, width }: VolumeSliderProps) => {
  const { volume, handleVolumeSliderChange } = useVolumeSlider();

  return (
    <Container
      min={0}
      max={100}
      value={volume}
      onChange={handleVolumeSliderChange}
      progressColor={'colors.onBackground'}
      height={sliderThickness}
      width={width}
    />
  );
};

const Container = styled(Slider)`
  height: 6px;

  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
`;
