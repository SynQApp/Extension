import { List, Scrollable, Text, token } from '@synq/ui';
import { useMemo } from 'react';
import { styled } from 'styled-components';

import { TrackListItem } from '~player-ui/components/TrackListItem';
import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import Layout from '~popup/Layout';
import { useAppSelector } from '~store';
import type { MusicService } from '~types';
import { getMusicServiceName } from '~util/musicService';

const SelectTabScreen = () => {
  const tabs = useAppSelector((state) => state.musicServiceTabs);
  const { setMusicServiceTab } = useMusicServiceTab();

  const tabGroups = useMemo(() => {
    const groups = tabs.reduce((acc, tab) => {
      const { musicService } = tab;

      if (!acc[musicService]) {
        acc[musicService] = [];
      }

      acc[musicService].push(tab);
      return acc;
    }, {} as Record<MusicService, typeof tabs>);

    return Object.entries(groups);
  }, [tabs]);

  return (
    <Layout>
      <Container>
        <HeaderText type="subtitle" size="lg">
          Select Tab
        </HeaderText>
        {tabGroups.map(([musicService, tabs]) => (
          <>
            <TabListHeaderText type="body" size="sm">
              {getMusicServiceName(musicService as MusicService)}
            </TabListHeaderText>
            <TabList>
              {tabs.map((tab) => (
                <TabListItem
                  key={tab.tabId}
                  primaryText={tab.preview?.name ?? '<No Music Playing>'}
                  secondaryText={tab.preview?.artistName}
                  onClick={() => setMusicServiceTab(tab)}
                  imageUrl={tab.preview?.albumCoverUrl ?? ''}
                  imageAlt={`Album art for ${tab.preview?.name}`}
                />
              ))}
            </TabList>
          </>
        ))}
      </Container>
    </Layout>
  );
};

export default SelectTabScreen;

const Container = styled(Scrollable)`
  background: ${token('colors.background')};
  padding-bottom: ${token('spacing.xs')};
  overflow-y: auto;
  max-height: 525px;
`;

const HeaderText = styled(Text)`
  margin: ${token('spacing.2xs')} ${token('spacing.lg')};
  font-weight: ${token('typography.fontWeights.semibold')};
`;

const TabListHeaderText = styled(Text)`
  margin: ${token('spacing.xs')} ${token('spacing.lg')} 0;
  font-weight: ${token('typography.fontWeights.medium')};
  color: ${token('colors.onBackgroundMedium')};
`;

const TabList = styled(List)`
  margin: ${token('spacing.xs')} ${token('spacing.lg')} ${token('spacing.md')};
  border-radius: ${token('radii.lg')};
  overflow: hidden;
`;

const TabListItem = styled(TrackListItem)`
  padding-left: ${token('spacing.sm')};
`;
