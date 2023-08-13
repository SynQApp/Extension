import { Button, Flex, Text, token } from '@synq/ui';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import Layout from '~popup/Layout';
import { getMusicServiceName } from '~util/musicService';

export const EnableAutoplayScreen = () => {
  const { musicServiceTab } = useMusicServiceTab();

  const handleEnableClick = () => {
    // Switch to selected tab
    chrome.tabs.update(musicServiceTab?.tabId, { active: true });
  };

  const musicServiceName = useMemo(
    () => getMusicServiceName(musicServiceTab.musicService),
    [musicServiceTab]
  );

  return (
    <Layout>
      <AutoplayScreenFlex align="center" direction="column">
        <Title type="subtitle" size="md">
          Please enable SynQ to continue.
        </Title>
        <Button variant="secondary" size="small" onClick={handleEnableClick}>
          {musicServiceName} →
        </Button>
      </AutoplayScreenFlex>
    </Layout>
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
