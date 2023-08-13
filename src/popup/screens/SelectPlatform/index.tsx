import { Image, Stack, Text, token } from '@synq/ui';
import AmazonLogo from 'data-base64:~assets/images/amazon-logo.svg';
import AppleLogo from 'data-base64:~assets/images/apple-logo.svg';
import SpotifyLogo from 'data-base64:~assets/images/spotify-logo.svg';
import WaveGraphicDark from 'data-base64:~assets/images/wave-graphic-dark.svg';
import WaveGraphicLight from 'data-base64:~assets/images/wave-graphic-light.svg';
import YoutubeLogo from 'data-base64:~assets/images/youtube-logo.svg';
import styled, { useTheme } from 'styled-components';

import {
  AMAZON_MUSIC_URL,
  AMAZON_MUSIC_URL_MATCH,
  APPLE_MUSIC_URL,
  APPLE_MUSIC_URL_MATCH,
  SPOTIFY_URL,
  SPOTIFY_URL_MATCH,
  YOUTUBE_MUSIC_URL,
  YOUTUBE_MUSIC_URL_MATCH
} from '~constants/urls';
import Layout from '~popup/Layout';
import MusicServiceButton from '~popup/components/MusicServiceButton';

const SelectPlatformScreen = () => {
  const theme = useTheme();

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
          <MusicServiceButtons spacing="md" direction="column">
            <MusicServiceButton
              name="Spotify"
              urlMatch={SPOTIFY_URL_MATCH}
              url={SPOTIFY_URL}
              logoSrc={SpotifyLogo}
            />
            <MusicServiceButton
              name="Apple Music"
              urlMatch={APPLE_MUSIC_URL_MATCH}
              url={APPLE_MUSIC_URL}
              logoSrc={AppleLogo}
            />
            <MusicServiceButton
              name="Amazon Music"
              urlMatch={AMAZON_MUSIC_URL_MATCH}
              url={AMAZON_MUSIC_URL}
              logoSrc={AmazonLogo}
            />
            <MusicServiceButton
              name="YouTube Music"
              urlMatch={YOUTUBE_MUSIC_URL_MATCH}
              url={YOUTUBE_MUSIC_URL}
              logoSrc={YoutubeLogo}
            />
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

export default SelectPlatformScreen;
