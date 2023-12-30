import { Button, Image, Text, token } from '@synq/ui';
import styled, { css } from 'styled-components';

interface MusicServiceButtonProps {
  name: string;
  urlMatch?: string;
  url?: string;
  onClick?: () => void;
  logoSrc: string;
  selected?: boolean;
}

const MusicServiceButton = ({
  name,
  url,
  onClick,
  urlMatch,
  logoSrc,
  selected
}: MusicServiceButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (!url || !urlMatch) {
      return;
    }

    chrome.tabs.query({ url: urlMatch }, (tabs) => {
      if (tabs?.length) {
        chrome.tabs.update(tabs[0]?.id!, { active: true });
      } else {
        chrome.tabs.create({ url });
      }
    });
  };

  return (
    <StyledButton
      onClick={handleClick}
      size="large"
      variant="secondary"
      $selected={selected}
    >
      <Image
        src={logoSrc}
        alt={`Logo for ${name}`}
        width="25px"
        height="25px"
        radius="full"
      />{' '}
      <ButtonText type="subtitle" size="sm">
        {name}
      </ButtonText>
    </StyledButton>
  );
};

interface StyledButtonProps {
  $selected?: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps>`
  border: 1px solid transparent;
  border-radius: ${token('radii.xl')};
  background: ${token('colors.surface01')};
  display: block;
  padding: ${token('spacing.md')} 0;
  transition: border 0.2s ease-in-out;
  font-weight: ${token('typography.fontWeights.medium')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${token('spacing.sm')};

  &:hover {
    border: 1px solid ${token('colors.borderHigh')};
  }

  ${({ $selected }) =>
    $selected &&
    css`
      border: 1px solid ${token('colors.borderHigh')};
    `}
`;

const ButtonText = styled(Text)`
  margin: 0;
  letter-spacing: 0.3px;
`;

export default MusicServiceButton;
