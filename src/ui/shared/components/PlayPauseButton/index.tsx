import { Button, Flex, Icon } from '@synqapp/ui';
import styled, { css, useTheme } from 'styled-components';

import { usePlayPauseButton } from './usePlayPauseButton';

interface PlayPauseButtonProps {
  size?: number;
}

export const PlayPauseButton = ({ size }: PlayPauseButtonProps) => {
  const { isPlaying, handleClick } = usePlayPauseButton();
  const theme = useTheme();

  if (!size) {
    size = 30;
  }

  return (
    <Container onClick={handleClick} $size={`${size}px`}>
      <PlayPauseButtonContent justify="center" align="center">
        <Icon
          width={size * 0.6}
          height={size * 0.6}
          icon={isPlaying ? 'pause' : 'play'}
          color={theme.colors.onBackground}
        />
      </PlayPauseButtonContent>
    </Container>
  );
};

interface ContainerProps {
  $size?: string;
}

const Container = styled(Button)<ContainerProps>`
  padding: 0;
  border-radius: 50%;
  opacity: 1;
  transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out 0s;

  &::before {
    border-radius: 50%;
  }

  ${({ $size }) =>
    $size &&
    css`
      height: ${$size};
      width: ${$size};
    `}
`;

const PlayPauseButtonContent = styled(Flex)`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;
