import { Icon } from '@synqapp/ui';
import { css, styled, useTheme } from 'styled-components';

import { useVolumeButton } from './useVolumeButton';

interface VolumeButtonProps {
  size?: number;
}

export const VolumeButton = ({ size }: VolumeButtonProps) => {
  const { muted, handleClick } = useVolumeButton();
  const theme = useTheme();

  if (!size) {
    size = 32;
  }

  return (
    <Container onClick={handleClick} $size={`${size}px`}>
      <Icon
        width={size * 0.66}
        height={size * 0.66}
        icon={muted ? 'volumeMuted' : 'volume'}
        color={theme.colors.onBackground}
      />
    </Container>
  );
};

interface ContainerProps {
  $size?: string;
}

const Container = styled.button<ContainerProps>`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.1s ease-in-out;

  ${({ $size }) =>
    $size &&
    css`
      height: ${$size};
      width: ${$size};
    `}
`;
