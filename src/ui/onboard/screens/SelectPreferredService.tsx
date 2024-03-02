import { MUSIC_SERVICE, type MusicService } from '@synq/music-service-clients';
import { Flex, Stack, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import adapters from '~adapters';
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

  const handleMusicServiceClick = (service: MusicService) => {
    handleChange(service);
    goToNextSlide();
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
            {adapters.map((adapter) => {
              return (
                <MusicServiceButton
                  key={adapter.id}
                  name={adapter.displayName}
                  logoSrc={adapter.icon}
                  onClick={() => handleMusicServiceClick(adapter.id)}
                  selected={preferredMusicService === adapter.id}
                />
              );
            })}
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
