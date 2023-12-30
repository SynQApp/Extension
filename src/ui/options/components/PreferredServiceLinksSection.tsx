import { Switch } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setSynqLinkPopupsEnabled } from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const PreferredServiceLinksSection = () => {
  const synqLinkPopupsEnabled = useAppSelector(
    (state) => state.settings.redirectsEnabled
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: boolean) => {
    dispatch(setSynqLinkPopupsEnabled(value));
  };

  return (
    <OptionsSection title="Preferred Service Links">
      <Switch checked={synqLinkPopupsEnabled} onChange={handleChange}>
        Show a popup to open links in your preferred music service
      </Switch>
    </OptionsSection>
  );
};
