import { Radio, RadioGroup, Stack, type ThemeName } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setAppearance } from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const AppearanceSection = () => {
  const appearance = useAppSelector((state) => state.settings.appearance);
  const dispatch = useAppDispatch();

  const handleChange = (value: ThemeName) => {
    dispatch(setAppearance(value));
  };

  return (
    <OptionsSection title="Appearance">
      <RadioGroup value={appearance} onChange={handleChange}>
        <Stack direction="column" spacing="xs">
          <Radio value="light">Light</Radio>
          <Radio value="dark">Dark</Radio>
        </Stack>
      </RadioGroup>
    </OptionsSection>
  );
};
