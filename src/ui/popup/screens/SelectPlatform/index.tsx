import { Button, Image, Stack, Text, token } from '@synqapp/ui';
import WaveGraphicDark from 'data-base64:~assets/images/wave-graphic-dark.svg';
import WaveGraphicLight from 'data-base64:~assets/images/wave-graphic-light.svg';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { useAppSelector } from '~/store';
import { useTabsQuery } from '~/ui/shared/hooks/useTabQuery';
import adapters from '~adapters';
import type { ReloadTabsBody } from '~background/messages/RELOAD_TABS';
import { sendToBackground } from '~core/messaging/sendToBackground';
import Layout from '~ui/popup/Layout';
import MusicServiceButton from '~ui/popup/components/MusicServiceButton';

const SelectPlatformScreen = () => {
  const theme = useTheme();
  const tabs = useAppSelector((state) => state.musicServiceTabs);
  const queriedMusicServiceTabs = useTabsQuery();

  /**
   * Tabs we have already asked the browser to reload. Reloading a tab whose
   * adapter fails to initialise leaves it exactly as unregistered as before, so
   * offering the action again produces an endless "needs to be refreshed" loop.
   * Remembering the attempt lets us offer the fix once and then be honest that
   * it did not work.
   */
  const [reloadAttemptedTabIds, setReloadAttemptedTabIds] = useState<number[]>(
    []
  );

  const missingTabs = (queriedMusicServiceTabs ?? []).filter(
    (tab) => tab.id !== undefined && !tabs?.find((t) => t.tabId === tab.id)
  );

  const reloadableTabs = missingTabs.filter(
    (tab) => !reloadAttemptedTabIds.includes(tab.id!)
  );

  const reloadableTabsCount = reloadableTabs.length;
  const unrecoverableTabsCount = missingTabs.length - reloadableTabsCount;

  const handleRefreshTabs = async () => {
    const tabIds = reloadableTabs.map((tab) => tab.id!);

    if (!tabIds.length) {
      return;
    }

    setReloadAttemptedTabIds((previous) => [...previous, ...tabIds]);

    try {
      await sendToBackground<ReloadTabsBody>({
        name: 'RELOAD_TABS',
        body: { tabIds }
      });
    } catch (error) {
      console.error('SynQ: Failed to reload music service tabs', error);
    }
  };

  return (
    <Layout hideButton>
      <Container>
        <div>
          <Heading type="display" size="xl" gradient>
            Choose Platform
          </Heading>
          <Description type="body" size="sm">
            Select your platform to start listening
          </Description>
          {reloadableTabsCount > 0 && (
            <AlertContainer>
              <AlertText type="body" size="sm" weight="semibold">
                {reloadableTabsCount} tab{reloadableTabsCount !== 1 ? 's' : ''}{' '}
                need{reloadableTabsCount !== 1 ? '' : 's'} to be refreshed to
                work with SynQ. Refresh{' '}
                {reloadableTabsCount !== 1 ? 'them' : 'it'}?
              </AlertText>
              <Button
                size="small"
                variant="secondary"
                onClick={handleRefreshTabs}
              >
                Refresh Tabs
              </Button>
            </AlertContainer>
          )}
          {reloadableTabsCount === 0 && unrecoverableTabsCount > 0 && (
            <AlertContainer>
              <AlertText type="body" size="sm" weight="semibold">
                SynQ still cannot control {unrecoverableTabsCount} open tab
                {unrecoverableTabsCount !== 1 ? 's' : ''} after refreshing. That
                music service may have changed its player, so the mini player
                will not work there for now.
              </AlertText>
            </AlertContainer>
          )}
          <MusicServiceButtons spacing="md" direction="column">
            {adapters.map((adapter) => (
              <MusicServiceButton
                key={adapter.id}
                name={`Continue with ${adapter.displayName}`}
                urlMatch={adapter.urlMatches[0]}
                url={adapter.baseUrl}
                logoSrc={adapter.icon}
              />
            ))}
          </MusicServiceButtons>
        </div>
        <WaveGraphicImage
          src={theme.name === 'light' ? WaveGraphicLight : WaveGraphicDark}
          alt="Wave Graphic"
        />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  background-color: ${token('colors.background')};
  padding-top: ${token('spacing.sm')};
  padding-bottom: ${token('spacing.3xl')};
  height: 100%;
  width: 100%;
`;

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.bold')};
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center;
  display: block;
`;

const Description = styled(Text)`
  color: ${token('colors.onBackground')};
  margin: ${token('spacing.md')} auto ${token('spacing.xs')};
  text-align: center;
  width: 250px;
  font-weight: ${token('typography.fontWeights.thin')};
`;

const MusicServiceButtons = styled(Stack)`
  margin: ${token('spacing.lg')} auto 0;
  width: 90%;
`;

const WaveGraphicImage = styled(Image)`
  bottom: -5px;
  height: auto;
  left: 0;
  position: fixed;
  transform: scale(1.2) translateX(20px);
  width: 100%;
`;

const AlertContainer = styled.div`
  margin: 16px;
  padding: 12px;
  border-radius: 4px;
  background-color: rgb(255 78 0 / 15%);
  border: 1px solid rgb(245 131 63);
  font-weight: 600;
`;

const AlertText = styled(Text)`
  margin: 0 0 8px 0;
`;

export default SelectPlatformScreen;
