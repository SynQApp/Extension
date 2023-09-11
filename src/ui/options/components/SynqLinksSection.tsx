import { Switch } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setSynqLinkPopupsEnabled } from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const SynqLinksSection = () => {
  const synqLinkPopupsEnabled = useAppSelector(
    (state) => state.settings.synqLinkPopupsEnabled
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: boolean) => {
    dispatch(setSynqLinkPopupsEnabled(value));
  };

  return (
    <OptionsSection title="SynQ Links">
      <Switch checked={synqLinkPopupsEnabled} onChange={handleChange}>
        Show a popup to open a SynQ link when not on your preferred service
      </Switch>
    </OptionsSection>
  );
};
