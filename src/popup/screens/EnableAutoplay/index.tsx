import { Button, Text, token } from '@synq/ui';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useTabs } from '~popup/contexts/Tabs';
import { getMusicServiceFromUrl } from '~util/getMusicServiceFromUrl';

export const EnableAutoplayScreen = () => {
  const { selectedTab } = useTabs();

  const handleEnableClick = () => {
    // Switch to selected tab
    chrome.tabs.update(selectedTab?.id, { active: true });
  };

  const musicService = useMemo(() => {
    return selectedTab?.url ? getMusicServiceFromUrl(selectedTab?.url) : '';
  }, [selectedTab]);

  return (
    <Container>
      <Title type="subtitle" size="md">
        Please enable SynQ to continue.
      </Title>
      <Button variant="secondary" size="small" onClick={handleEnableClick}>
        {musicService} →
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
