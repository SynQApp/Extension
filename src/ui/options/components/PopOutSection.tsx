import { Switch } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setPopOutButtonEnabled } from '~store/slices/settings';

import { OptionsSection } from './OptionsSection';

export const PopOutSection = () => {
  const synqLinkPopupsEnabled = useAppSelector(
    (state) => state.settings.popOutButtonEnabled
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: boolean) => {
    dispatch(setPopOutButtonEnabled(value));
  };

  return (
    <OptionsSection title="Pop Out Mini Player">
      <Switch checked={synqLinkPopupsEnabled} onChange={handleChange}>
        Show pop out button on music services
      </Switch>
    </OptionsSection>
  );
};
