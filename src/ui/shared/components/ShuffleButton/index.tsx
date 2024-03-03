import { Icon } from '@synqapp/ui';
import { css, styled, useTheme } from 'styled-components';

interface ShuffleButtonProps {
  size?: number;
}

export const ShuffleButton = ({ size }: ShuffleButtonProps) => {
  const theme = useTheme();

  if (!size) {
    size = 32;
  }

  return (
    <Container onClick={() => console.log('shuffle')} $size={`${size}px`}>
      <Icon
        width={size * 0.66}
        height={size * 0.66}
        icon="shuffle"
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
