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
    <StyledButton onClick={handleClick} size="large" variant="primary">
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
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

export default MusicServiceButton;
