import { token } from '@synq/ui';
import { useMemo } from 'react';
import { styled } from 'styled-components';

interface GradientSliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  progressColor: string;
  max: number;
  value: number;
}

export const Slider = ({
  className,
  progressColor,
  ...inputProps
}: GradientSliderProps) => {
  const { max, value } = inputProps;
  const progressPercentage = useMemo(() => (value / max) * 100, [value, max]);

  return (
    <GradientSliderContainer className={className}>
      <GradientSliderInput type="range" {...inputProps} />
      <GradientSliderProgressGlow
        className="glow"
        $progressPercentage={progressPercentage}
        $progressColor={progressColor}
      />
      <GradientSliderProgress
        className="progress"
        $progressPercentage={progressPercentage}
        $progressColor={progressColor}
      />
    </GradientSliderContainer>
  );
};

const GradientSliderContainer = styled.div`
  background: ${token('colors.borderLow')};
  border-radius: 5px;
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: relative;

  &:hover {
    & > .glow {
      filter: blur(3px);
    }

    & > .progress {
      transform: scaleY(1.2);
    }
  }
`;

const GradientSliderInput = styled.input`
  height: 100%;
  -webkit-appearance: none;
  width: 100%;
  outline: none;
  background: transparent;
  z-index: 100;
  position: absolute;
  top: 0;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    height: 12px;
    width: 12px;
  }

  &::-moz-range-thumb {
    background: transparent;
    cursor: pointer;
    height: 12px;
    width: 12px;
  }
`;

interface GradientSliderProgressProps {
  $progressPercentage: number;
  $progressColor: string;
}

const GradientSliderProgress = styled.div<GradientSliderProgressProps>`
  background: ${({ $progressColor }) => $progressColor};
  border-radius: 5px;
  height: 100%;
  width: ${(props: GradientSliderProgressProps) => props.$progressPercentage}%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.1s ease-in-out;
`;

const GradientSliderProgressGlow = styled.div<GradientSliderProgressProps>`
  background: ${({ $progressColor }) => $progressColor};
  border-radius: 5px;
  height: 100%;
  width: ${(props: GradientSliderProgressProps) => props.$progressPercentage}%;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(1px);
  transition: filter 0.1s ease-in-out;
`;
