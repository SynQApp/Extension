import { MUSIC_SERVICE, type MusicService } from '@synq/music-service-clients';
import { Radio, RadioGroup, Stack } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setPreferredMusicService } from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const PreferredMusicServiceSection = () => {
  const preferredMusicService = useAppSelector(
    (state) => state.settings.preferredMusicService
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    if (!Object.values(MUSIC_SERVICE).includes(value as MusicService)) {
      return;
    }

    dispatch(setPreferredMusicService(value as MusicService));
  };

  return (
    <OptionsSection title="Preferred music service">
      <RadioGroup value={preferredMusicService} onChange={handleChange}>
        <Stack direction="column" spacing="xs">
          <Radio value={MUSIC_SERVICE.SPOTIFY}>Spotify</Radio>
          <Radio value={MUSIC_SERVICE.APPLEMUSIC}>Apple Music</Radio>
          <Radio value={MUSIC_SERVICE.AMAZONMUSIC}>Amazon Music</Radio>
          <Radio value={MUSIC_SERVICE.YOUTUBEMUSIC}>YouTube Music</Radio>
        </Stack>
      </RadioGroup>
    </OptionsSection>
  );
};
