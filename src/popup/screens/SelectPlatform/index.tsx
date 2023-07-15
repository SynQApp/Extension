import { Text, token } from '@synq/ui';
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
import MusicServiceButton from '~popup/components/MusicServiceButton';

const SelectPlatformScreen = () => {
  return (
    <Container>
      <div>
        <Heading variant="h2">
          <span>Choose</span>{' '}
          <Text variant="h2" as="span" gradient glow>
            Service
          </Text>
        </Heading>
        <Description variant="body1">
          Select your preferred music service to get started.
        </Description>
        <MusicServiceButtons>
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled(Text)`
  letter-spacing: 0.5px;
  margin: 0;
  padding-bottom: ${token('spacing.sm')};
  text-align: center;
`;

const Description = styled(Text)`
  margin: 0 auto;
  text-align: center;
  width: 250px;
`;

const MusicServiceButtons = styled.div`
  display: flex;
  flex-direction: column;
  height: 210px;
  justify-content: space-between;
  margin: 20px auto 0;
  width: 90%;
`;

const WaveGraphicImage = styled.img`
  bottom: 0;
  height: auto;
  left: 0;
  position: fixed;
  transform: scale(1.2) translateX(20px);
  width: 100%;
`;

export default SelectPlatformScreen;
