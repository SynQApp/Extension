import { MUSIC_SERVICE, type MusicService } from '@synq/music-service-clients';
import { Flex, Stack, Text, token } from '@synq/ui';
import AmazonLogo from 'data-base64:~assets/images/amazon-logo.svg';
import AppleLogo from 'data-base64:~assets/images/apple-logo.svg';
import SpotifyLogo from 'data-base64:~assets/images/spotify-logo.svg';
import YoutubeLogo from 'data-base64:~assets/images/youtube-logo.svg';
import { styled } from 'styled-components';

import { SPOTIFY_ENABLED } from '~constants/features';
import { useAppDispatch, useAppSelector } from '~store';
import { setPreferredMusicService } from '~store/slices/settings';
import MusicServiceButton from '~ui/popup/components/MusicServiceButton';
import { sendAnalytic } from '~util/analytics';

import { Screen } from '../components/Screen';

interface SelectPreferredServiceProps {
  goToNextSlide: () => void;
}

export const SelectPreferredService = ({
  goToNextSlide
}: SelectPreferredServiceProps) => {
  const preferredMusicService = useAppSelector(
    (state) => state.settings.preferredMusicService
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    if (!Object.values(MUSIC_SERVICE).includes(value as MusicService)) {
      return;
    }

    dispatch(setPreferredMusicService(value as MusicService));

    sendAnalytic({
      name: 'onboarding_select_service',
      params: {
        service: value
      }
    });
  };

  return (
    <Screen>
      <Container direction="column" justify="center">
        <Stack direction="column" align="center" spacing="xs">
          <TitleText type="display" size="3xl" weight="semibold">
            Select your preferred music service
          </TitleText>
          <DescriptionText type="body" size="md" weight="regular">
            SynQ works with several music services. Select your preferred music
            service to get started.
          </DescriptionText>
          <MusicServiceButtons justify="center" direction="column">
            {SPOTIFY_ENABLED && (
              <MusicServiceButton
                name="Spotify"
                logoSrc={SpotifyLogo}
                onClick={() => {
                  handleChange(MUSIC_SERVICE.SPOTIFY);
                  goToNextSlide();
                }}
                selected={preferredMusicService === MUSIC_SERVICE.SPOTIFY}
              />
            )}
            <MusicServiceButton
              name="Apple Music"
              logoSrc={AppleLogo}
              onClick={() => {
                handleChange(MUSIC_SERVICE.APPLEMUSIC);
                goToNextSlide();
              }}
              selected={preferredMusicService === MUSIC_SERVICE.APPLEMUSIC}
            />
            <MusicServiceButton
              name="Amazon Music"
              logoSrc={AmazonLogo}
              onClick={() => {
                handleChange(MUSIC_SERVICE.AMAZONMUSIC);
                goToNextSlide();
              }}
              selected={preferredMusicService === MUSIC_SERVICE.AMAZONMUSIC}
            />
            <MusicServiceButton
              name="YouTube Music"
              logoSrc={YoutubeLogo}
              onClick={() => {
                handleChange(MUSIC_SERVICE.YOUTUBEMUSIC);
                goToNextSlide();
              }}
              selected={preferredMusicService === MUSIC_SERVICE.YOUTUBEMUSIC}
            />
          </MusicServiceButtons>
        </Stack>
      </Container>
    </Screen>
  );
};

const Container = styled(Flex)`
  height: calc(100vh - 100px);
  overflow: hidden;
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
  color: ${token('colors.onBackgroundMedium')};
`;

const MusicServiceButtons = styled(Stack)`
  margin: ${token('spacing.lg')} auto 0;
  width: 300px;
`;
