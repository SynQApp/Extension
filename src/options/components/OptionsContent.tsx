import { Radio, RadioGroup, Stack, Switch, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { AppearanceSection } from './AppearanceSection';
import { KeyControlsSection } from './KeyControlsSection';
import { LastFmSection } from './LastFmSection';
import { NotificationsSection } from './NotificationsSection';
import { OptionsSection } from './OptionsSection';
import { PreferredMusicServiceSection } from './PreferredMusicServiceSection';
import { SynqLinksSection } from './SynqLinksSection';

export const OptionsContent = () => {
  return (
    <Container>
      <Title type="display" size="4xl">
        Settings
      </Title>
      <AppearanceSection />
      <PreferredMusicServiceSection />
      <KeyControlsSection />
      <NotificationsSection />
      <SynqLinksSection />
      <LastFmSection />
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
