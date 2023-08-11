import { Image, Stack, Text, token } from '@synq/ui';
import WaveGraphic from 'data-base64:~assets/images/wave-graphic.svg';
import styled from 'styled-components';

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
import MusicServiceButton from '~player-ui/components/MusicServiceButton';

const SelectPlatformScreen = () => {
  return (
    <Container>
      <div>
        <Heading type="display" size="2xl" forwardedAs="h2">
          <span>Choose</span>{' '}
          <Text type="display" size="2xl" as="span" gradient glow>
            Service
          </Text>
        </Heading>
        <Description type="body" size="sm">
          Select your preferred music service to get started.
        </Description>
        <MusicServiceButtons spacing="sm" direction="column">
          <MusicServiceButton
            name="Spotify"
            urlMatch={SPOTIFY_URL_MATCH}
            url={SPOTIFY_URL}
          />
          <MusicServiceButton
            name="Apple Music"
            urlMatch={APPLE_MUSIC_URL_MATCH}
            url={APPLE_MUSIC_URL}
          />
          <MusicServiceButton
            name="Amazon Music"
            urlMatch={AMAZON_MUSIC_URL_MATCH}
            url={AMAZON_MUSIC_URL}
          />
          <MusicServiceButton
            name="YouTube Music"
            urlMatch={YOUTUBE_MUSIC_URL_MATCH}
            url={YOUTUBE_MUSIC_URL}
          />
        </MusicServiceButtons>
      </div>
      <WaveGraphicImage src={WaveGraphic} alt="Wave Graphic" />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${token('colors.background')};
  padding-top: ${token('spacing.md')};
  padding-bottom: ${token('spacing.lg')};
  height: 100%;
  width: 100%;
`;

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.bold')};
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center;
`;

const Description = styled(Text)`
  color: ${token('colors.onBackgroundMedium')};
  margin: ${token('spacing.xs')} auto;
  text-align: center;
  width: 250px;
`;

const MusicServiceButtons = styled(Stack)`
  margin: ${token('spacing.md')} auto 0;
  width: 90%;
`;

const WaveGraphicImage = styled(Image)`
  bottom: 0;
  height: auto;
  left: 0;
  position: fixed;
  transform: scale(1.2) translateX(20px);
  width: 100%;
`;

export default SelectPlatformScreen;
