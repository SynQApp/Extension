import { Button, Flex, Stack, Text, token } from '@synqapp/ui';
import { styled } from 'styled-components';

import { Screen } from '../components/Screen';

interface YtmPlusIntroProps {
  goToNextSlide: () => void;
}

export const YtmPlusIntro = ({ goToNextSlide }: YtmPlusIntroProps) => {
  const url = new URL(window.location.href);
  const showLastFmMessage = url.searchParams.get('lastfm') === 'true';

  return (
    <Screen>
      <Container direction="column" justify="center">
        <Stack direction="column" spacing="xl">
          <Stack direction="column" spacing="2xs">
            <TitleText type="display" size="5xl" weight="semibold">
              <Text
                type="display"
                size="5xl"
                weight="semibold"
                as="span"
                gradient
              >
                YTM+ is now SynQ
              </Text>
            </TitleText>
            <DescriptionText type="subtitle" size="lg" weight="regular">
              From the developers of YTM+, SynQ upgrades your YTM+ experience
              with all-new features and a fresh look.
            </DescriptionText>
          </Stack>
          <ContinueButton size="large" rounded onClick={goToNextSlide}>
            Get Started
          </ContinueButton>
        </Stack>
        {showLastFmMessage && (
          <LastFmMessageContainer direction="column" align="center">
            <LastFmMessage>
              <LastFmMessageText type="subtitle" size="sm" weight="regular">
                Note: You previously connected to Last.fm with YTM+. SynQ no
                longer supports Last.fm, but you can still scrobble your music
                by using the officially-recommended extension on{' '}
                <Link
                  href="https://chromewebstore.google.com/detail/web-scrobbler/hhinaapppaileiechjoiifaancjggfjm"
                  target="_blank"
                >
                  Chrome
                </Link>{' '}
                or{' '}
                <Link
                  href="https://microsoftedge.microsoft.com/addons/detail/web-scrobbler/obiekdelmkmlgnhddmmnpnfhngejbnnc"
                  target="_blank"
                >
                  Edge
                </Link>
                .
              </LastFmMessageText>
            </LastFmMessage>
          </LastFmMessageContainer>
        )}
      </Container>
    </Screen>
  );
};

const Container = styled(Flex)`
  height: calc(100vh - 100px);
  overflow: hidden;
  position: relative;
`;

const TitleText = styled(Text)`
  text-align: center;
  margin: 0 auto;
  display: block;
`;

const DescriptionText = styled(Text)`
  text-align: center;
  margin: 0 auto;
  display: block;
  max-width: 750px;
`;

const ContinueButton = styled(Button)`
  margin: 0 auto;
  display: block;
`;

const LastFmMessageContainer = styled(Flex)`
  position: absolute;
  bottom: 50px;
  height: unset;
`;

const LastFmMessage = styled.div`
  border-radius: ${token('radii.xl')};
  background: ${token('colors.background')};
  color: ${token('colors.onSurface')};
  padding: ${token('spacing.md')};
  width: 800px;
  z-index: 1000;
`;

const LastFmMessageText = styled(Text)`
  text-align: center;
  color: ${token('colors.onBackgroundMedium')};
`;

const Link = styled.a`
  color: ${token('colors.onBackground')};
  text-decoration: underline;
  cursor: pointer;
`;
