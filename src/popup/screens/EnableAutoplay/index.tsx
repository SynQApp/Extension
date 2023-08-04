import { Button, Text, token } from '@synq/ui';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useTabs } from '~popup/contexts/Tabs';
import { useMusicService } from '~popup/hooks/useMusicService';
import { getMusicServiceName } from '~util/musicService';

export const EnableAutoplayScreen = () => {
  const { selectedTab } = useTabs();
  const musicService = useMusicService();

  const handleEnableClick = () => {
    // Switch to selected tab
    chrome.tabs.update(selectedTab?.id, { active: true });
  };

  const musicServiceName = useMemo(
    () => (selectedTab?.url ? getMusicServiceName(musicService) : ''),
    [selectedTab]
  );

  return (
    <Container>
      <Title type="subtitle" size="md">
        Please enable SynQ to continue.
      </Title>
      <Button variant="secondary" size="small" onClick={handleEnableClick}>
        {musicServiceName} →
      </Button>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: ${token('colors.background')};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${token('spacing.lg')};
  padding-top: ${token('spacing.sm')};
  width: 100%;
`;

const Title = styled(Text)`
  font-weight: ${token('typography.fontWeights.bold')};
  letter-spacing: 0.5px;
  text-align: center;
`;

export default EnableAutoplayScreen;
