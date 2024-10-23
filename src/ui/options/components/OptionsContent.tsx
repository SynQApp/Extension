import { Text, token } from '@synqapp/ui';
import { styled } from 'styled-components';

import { KeyControlsSection } from './KeyControlsSection';
import { NotificationsSection } from './NotificationsSection';
import { PopOutSection } from './PopOutSection';
import { PreferredMusicServiceSection } from './PreferredMusicServiceSection';
import { PreferredServiceLinksSection } from './PreferredServiceLinksSection';

export const OptionsContent = () => {
  return (
    <Container>
      <GitHubContainer>
        <GitHubTitle type="subtitle" size="lg" weight="semibold">
          We're open source!
        </GitHubTitle>
        <Text type="body" size="md">
          Please star our GitHub repo if you like this extension, and if you're
          a programmer, feel free to contribute to the code!
        </Text>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=SynQApp&repo=Extension&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="130"
          height="30"
          title="GitHub"
        ></iframe>
      </GitHubContainer>
      <Title type="display" size="4xl">
        Settings
      </Title>
      <PreferredMusicServiceSection />
      <PreferredServiceLinksSection />
      <KeyControlsSection />
      <NotificationsSection />
      <PopOutSection />
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled(Text)`
  font-weight: ${token('typography.fontWeights.bold')};
`;

const GitHubContainer = styled.div`
  background-color: rgb(255 255 255 / 7%);
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 12px;
`;

const GitHubTitle = styled(Text)`
  margin: 0;
`;
