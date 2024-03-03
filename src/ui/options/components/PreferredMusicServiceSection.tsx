import { Radio, RadioGroup, Stack } from '@synqapp/ui';

import adapters from '~adapters';
import { useAppDispatch, useAppSelector } from '~store';
import { setPreferredMusicService } from '~store/slices/settings';
import { MUSIC_SERVICE, type MusicService } from '~types';
import { sendAnalytic } from '~util/analytics';

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

    sendAnalytic({
      name: 'preferred_music_service_changed',
      params: { value }
    });
  };

  return (
    <OptionsSection title="Preferred music service">
      <RadioGroup value={preferredMusicService} onChange={handleChange}>
        <Stack direction="column" spacing="xs">
          {adapters.map((adapter) => (
            <Radio key={adapter.id} value={adapter.id}>
              {adapter.displayName}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </OptionsSection>
  );
};
