import { Radio, RadioGroup, Stack } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setPreferredMusicService } from '~store/slices/settings';
import { MusicService } from '~types';

import { OptionsSection } from './OptionsSection';

export const PreferredMusicServiceSection = () => {
  const preferredMusicService = useAppSelector(
    (state) => state.settings.preferredMusicService
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: MusicService) => {
    dispatch(setPreferredMusicService(value));
  };

  return (
    <OptionsSection title="Preferred music service">
      <RadioGroup value={preferredMusicService} onChange={handleChange}>
        <Stack direction="column" spacing="xs">
          <Radio value={MusicService.APPLE_MUSIC}>Apple Music</Radio>
          <Radio value={MusicService.SPOTIFY}>Spotify</Radio>
          <Radio value={MusicService.YOUTUBE_MUSIC}>YouTube Music</Radio>
          <Radio value={MusicService.AMAZON_MUSIC}>Amazon Music</Radio>
        </Stack>
      </RadioGroup>
    </OptionsSection>
  );
};
