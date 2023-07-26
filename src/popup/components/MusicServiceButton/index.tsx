import { Button, token } from '@synq/ui';
import styled from 'styled-components';

interface MusicServiceButtonProps {
  name: string;
  urlMatch: string;
  url: string;
}

const MusicServiceButton = ({
  name,
  url,
  urlMatch
}: MusicServiceButtonProps) => {
  const handleClick = () => {
    chrome.tabs.query({ url: urlMatch }, (tabs) => {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.create({ url });
      }
    });
  };

  return (
    <StyledButton onClick={handleClick} size="large" variant="secondary">
      {name}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  border: 1px solid ${token('colors.base.white')};
  display: block;
  font-size: ${token('typography.fontSizes.md')};
  padding: 12px 0;

  &::before {
    background: ${token('colors.gradient')};
    content: '';
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 0.2s ease-in-out;
    width: 100%;
    z-index: -1;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

export default MusicServiceButton;
