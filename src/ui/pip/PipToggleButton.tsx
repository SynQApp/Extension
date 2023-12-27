import { Image, token } from '@synq/ui';
import SynQIcon from 'data-base64:~assets/images/icon-filled.svg';
import { styled } from 'styled-components';

import { useAppSelector } from '~store';

interface PipToggleButtonProps {
  onClick: () => void;
}

export const PipToggleButton = ({ onClick }: PipToggleButtonProps) => {
  const settings = useAppSelector((state) => state.settings);

  return (
    settings.popOutButtonEnabled && (
      <ToggleButton onClick={onClick}>
        <ToggleButtonContent>
          <ToggleButtonImage src={SynQIcon} alt="SynQ Icon" />
        </ToggleButtonContent>
      </ToggleButton>
    )
  );
};

export const ToggleButton = styled.button`
  background: linear-gradient(
    to bottom,
    ${token('colors.base.orange.4')} 0%,
    ${token('colors.base.pink.4')} 100%
  );
  border-bottom-left-radius: calc(${token('radii.md')});
  border-top-left-radius: calc(${token('radii.md')});
  border: none;
  box-shadow: none;
  cursor: pointer;
  height: 80px;
  outline: none;
  width: 35px;
  z-index: 999;
`;

export const ToggleButtonContent = styled.div`
  align-items: center;
  background: ${token('colors.surface')};
  border-bottom-left-radius: calc(${token('radii.md')} - 1px);
  border-top-left-radius: calc(${token('radii.md')} - 1px);
  display: flex;
  height: 76px;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 2px;
  width: 33px;
`;

export const ToggleButtonImage = styled(Image)`
  height: 25px;
  width: 25px;
`;
