import { Icon } from '@synq/ui';
import { css, styled, useTheme } from 'styled-components';

import { useNextButton } from './useNextButton';

interface NextButtonProps {
  size?: number;
}

export const NextButton = ({ size }: NextButtonProps) => {
  const { handleClick } = useNextButton();
  const theme = useTheme();

  if (!size) {
    size = 32;
  }

  return (
    <Container onClick={handleClick} $size={`${size}px`}>
      <Icon
        width={size * 0.66}
        height={size * 0.66}
        icon="next"
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
