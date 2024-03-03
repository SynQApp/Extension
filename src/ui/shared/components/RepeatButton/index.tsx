import { Icon } from '@synqapp/ui';
import { css, styled, useTheme } from 'styled-components';

import { RepeatMode } from '~types';

import { useRepeatButton } from './useRepeatButton';

interface RepeatButtonProps {
  size?: number;
}

export const RepeatButton = ({ size }: RepeatButtonProps) => {
  const { repeatMode, handleClick } = useRepeatButton();
  const theme = useTheme();

  if (!size) {
    size = 32;
  }

  return (
    <Container onClick={handleClick} $size={`${size}px`}>
      <Icon
        width={size * 0.66}
        height={size * 0.66}
        icon={repeatMode === RepeatMode.REPEAT_ONE ? 'repeatOne' : 'repeatAll'}
        color={
          repeatMode === RepeatMode.NO_REPEAT
            ? theme.colors.onBackground
            : theme.colors.base.orange[4]
        }
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
