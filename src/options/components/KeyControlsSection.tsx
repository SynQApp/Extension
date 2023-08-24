import { Stack, Switch } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import {
  setMiniPlayerKeyControlsEnabled,
  setMusicServiceKeyControlsEnabled
} from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const KeyControlsSection = () => {
  const miniPlayerControlsEnabled = useAppSelector(
    (state) => state.settings.miniPlayerKeyControlsEnabled
  );
  const musicServiceControlsEnabled = useAppSelector(
    (state) => state.settings.musicServiceKeyControlsEnabled
  );
  const dispatch = useAppDispatch();

  const handleMiniPlayerControlsChange = (value: boolean) => {
    dispatch(setMiniPlayerKeyControlsEnabled(value));
  };

  const handleMusicServiceControlsChange = (value: boolean) => {
    dispatch(setMusicServiceKeyControlsEnabled(value));
  };

  return (
    <OptionsSection title="Key controls">
      <Stack direction="column" spacing="sm">
        <Switch
          checked={miniPlayerControlsEnabled}
          onChange={handleMiniPlayerControlsChange}
        >
          Enable mini player key controls
        </Switch>
        <Switch
          checked={musicServiceControlsEnabled}
          onChange={handleMusicServiceControlsChange}
        >
          Enable music service key controls
        </Switch>
      </Stack>
    </OptionsSection>
  );
};
