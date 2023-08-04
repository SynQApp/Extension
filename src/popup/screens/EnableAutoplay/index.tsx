import { Button, Flex, Text, token } from '@synq/ui';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useMusicService } from '~player-ui/contexts/MusicService';
import { useTabs } from '~player-ui/contexts/Tabs';
import { getMusicServiceName } from '~util/musicService';

export const EnableAutoplayScreen = () => {
  const { selectedTab } = useTabs();
  const { musicService } = useMusicService();

  const handleEnableClick = () => {
    // Switch to selected tab
    chrome.tabs.update(selectedTab?.id, { active: true });
  };

  const musicServiceName = useMemo(
    () => (selectedTab?.url ? getMusicServiceName(musicService) : ''),
    [selectedTab]
  );

  return (
    <AutoplayScreenFlex align="center" direction="column">
      <Title type="subtitle" size="md">
        Please enable SynQ to continue.
      </Title>
      <Button variant="secondary" size="small" onClick={handleEnableClick}>
        {musicServiceName} →
      </Button>
    </AutoplayScreenFlex>
  );
};

const AutoplayScreenFlex = styled(Flex)`
  background-color: ${token('colors.background')};
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
