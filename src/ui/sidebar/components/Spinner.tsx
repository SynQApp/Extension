import { token } from '@synq/ui';
import { styled } from 'styled-components';

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return <SpinnerStyled className={className} />;
};

const SpinnerStyled = styled.div`
  animation: spin 1s linear infinite;
  border: 5px solid ${token('colors.onBackgroundLow')};
  border-radius: 50%;
  border-top: 5px solid ${token('colors.onBackground')};
  height: 40px;
  width: 40px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
