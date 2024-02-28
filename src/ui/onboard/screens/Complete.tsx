import { Button, Image, Scrollable, Stack, Text, token } from '@synq/ui';
import MiniPlayerExample from 'data-base64:~assets/images/mini-player-example.png';
import RedirectExample from 'data-base64:~assets/images/redirect-example.png';
import { styled } from 'styled-components';

import { SPOTIFY_ENABLED } from '~constants/features';
import {
  AMAZON_MUSIC_URL,
  APPLE_MUSIC_URL,
  SPOTIFY_URL,
  YOUTUBE_MUSIC_URL
} from '~constants/urls';
import { useAppSelector } from '~store';
import { sendAnalytic } from '~util/analytics';
import { getMusicServiceName } from '~util/musicService';

import { Screen } from '../components/Screen';

const EXAMPLE_SPOTIFY_LINK =
  'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC';
const EXAMPLE_APPLE_MUSIC_LINK =
  'https://music.apple.com/us/album/never-gonna-give-you-up/1452434638?i=1452434833';
const EXAMPLE_YOUTUBE_MUSIC_LINK =
  'https://music.youtube.com/watch?v=lYBUbBu4W08';

export const Complete = () => {
  const musicService = useAppSelector(
    (state) => state.settings.preferredMusicService
  );
  const musicServiceName = getMusicServiceName(musicService);

  const handleOpenMusicService = () => {
    switch (musicService) {
      case 'SPOTIFY':
        window.open(SPOTIFY_URL);
        break;
      case 'YOUTUBEMUSIC':
        window.open(YOUTUBE_MUSIC_URL);
        break;
      case 'APPLEMUSIC':
        window.open(APPLE_MUSIC_URL);
        break;
      case 'AMAZONMUSIC':
        window.open(AMAZON_MUSIC_URL);
        break;
    }

    sendAnalytic({
      name: 'onboarding_popup_example'
    });
  };

  const handleRedirectExampleClick = () => {
    switch (musicService) {
      case 'SPOTIFY':
        window.open(EXAMPLE_APPLE_MUSIC_LINK);
        break;
      case 'APPLEMUSIC':
        window.open(
          SPOTIFY_ENABLED ? EXAMPLE_SPOTIFY_LINK : EXAMPLE_YOUTUBE_MUSIC_LINK
        );
        break;
      default:
        window.open(
          SPOTIFY_ENABLED ? EXAMPLE_SPOTIFY_LINK : EXAMPLE_APPLE_MUSIC_LINK
        );
        break;
    }

    sendAnalytic({
      name: 'onboarding_redirect_example'
    });
  };

  const handleGoToSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Screen>
      <Scrollable height="100%">
        <Main direction="column" spacing="3xl" align="center">
          <div>
            <TitleText type="display" size="5xl" weight="semibold">
              <Text
                type="display"
                size="5xl"
                weight="semibold"
                as="span"
                gradient
              >
                You're all set!
              </Text>
            </TitleText>
            <DescriptionText type="subtitle" size="lg" weight="regular">
              SynQ is now ready to use. Try out some of the features below!
            </DescriptionText>
          </div>
          <DemoSection direction="column" spacing="3xl">
            <Stack spacing="lg" justify="center">
              <MiniPlayerImage
                src={MiniPlayerExample}
                width="300px"
                alt="Mini player screenshot"
                radius="lg"
              />
              <Stack direction="column" spacing="lg">
                <ExplainerText type="subtitle" size="2xl" weight="semibold">
                  Mini Player
                </ExplainerText>
                <ExplainerDescriptionText
                  type="body"
                  size="md"
                  weight="regular"
                >
                  <HighlightedText>Open {musicServiceName}</HighlightedText> and
                  play something. Then{' '}
                  <HighlightedText>click the SynQ logo</HighlightedText> in your
                  extensions toolbar (standard mode) or on the right hand side
                  on {musicServiceName} (always-on-top mode).
                </ExplainerDescriptionText>
                <span>
                  <Button
                    size="medium"
                    rounded
                    onClick={handleOpenMusicService}
                  >
                    Open {musicServiceName}
                  </Button>
                </span>
              </Stack>
            </Stack>
            <Stack spacing="lg" justify="center">
              <Stack direction="column" spacing="lg">
                <ExplainerText type="subtitle" size="2xl" weight="semibold">
                  Cross-Service Redirects
                </ExplainerText>
                <ExplainerDescriptionText
                  type="body"
                  size="md"
                  weight="regular"
                >
                  Receive a link to a song{' '}
                  <HighlightedText>not on {musicServiceName}</HighlightedText>?
                  No problem! SynQ will offer to{' '}
                  <HighlightedText>
                    open it in {musicServiceName} for you.
                  </HighlightedText>{' '}
                  Currently supported on{' '}
                  <HighlightedText>Apple Music</HighlightedText>,{' '}
                  <HighlightedText>Amazon Music</HighlightedText>, and{' '}
                  <HighlightedText>YouTube Music</HighlightedText>.
                </ExplainerDescriptionText>
                <span>
                  <Button
                    size="medium"
                    rounded
                    onClick={handleRedirectExampleClick}
                  >
                    Example{' '}
                    {SPOTIFY_ENABLED
                      ? musicService === 'SPOTIFY'
                        ? 'Apple Music'
                        : 'Spotify'
                      : musicService === 'APPLEMUSIC'
                      ? 'YouTube Music'
                      : 'Apple Music'}{' '}
                    Link
                  </Button>
                </span>
              </Stack>
              <OpenInMusicServiceImage
                src={RedirectExample}
                width="300px"
                alt="Redirect example screenshot"
                radius="lg"
              />
            </Stack>
          </DemoSection>
          <Stack direction="column" spacing="sm" align="center">
            <TitleText type="subtitle" size="2xl" weight="semibold">
              More to Come Soon!
            </TitleText>
            <DescriptionText type="subtitle" size="md" weight="regular">
              We're hard at work building new features for SynQ. Stay tuned! In
              the meantime, check out the settings page to customize your
              experience.
            </DescriptionText>
            <br />
            <span>
              <Button rounded onClick={handleGoToSettings}>
                Go to Settings
              </Button>
            </span>
          </Stack>
        </Main>
      </Scrollable>
    </Screen>
  );
};

const Main = styled(Stack)`
  padding-bottom: ${token('spacing.3xl')};
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

const HighlightedText = styled.span`
  color: ${token('colors.onBackground')};
  font-weight: ${token('typography.fontWeights.semibold')};
`;

const DemoSection = styled(Stack)`
  border-bottom: 1px solid rgb(255, 255, 255, 0.15);
  width: 830px;
  margin: 0 auto;
  padding-bottom: ${token('spacing.3xl')};
`;

const MiniPlayerImage = styled(Image)`
  transform: rotate(-1deg);
  box-shadow: 0 0 15px 1px #81818121;
`;

const OpenInMusicServiceImage = styled(Image)`
  transform: rotate(1deg);
  box-shadow: 0 0 15px 1px #81818121;
  object-fit: cover;
  height: 100%;
`;

const ExplainerText = styled(Text)`
  margin: 0 auto;
  width: 500px;
`;

const ExplainerDescriptionText = styled(ExplainerText)`
  color: ${token('colors.onBackgroundMedium')};
  line-height: 1.5;
`;
