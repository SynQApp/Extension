import { Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { KeyControlsSection } from './KeyControlsSection';
import { NotificationsSection } from './NotificationsSection';
import { PopOutSection } from './PopOutSection';
import { PreferredMusicServiceSection } from './PreferredMusicServiceSection';
import { PreferredServiceLinksSection } from './PreferredServiceLinksSection';

export const OptionsContent = () => {
  return (
    <Container>
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
