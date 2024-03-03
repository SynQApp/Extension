import { Switch } from '@synqapp/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setPopOutButtonEnabled } from '~store/slices/settings';
import { sendAnalytic } from '~util/analytics';

import { OptionsSection } from './OptionsSection';

export const PopOutSection = () => {
  const synqLinkPopupsEnabled = useAppSelector(
    (state) => state.settings.popOutButtonEnabled
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: boolean) => {
    dispatch(setPopOutButtonEnabled(value));
    sendAnalytic({
      name: 'pop_out_button_enabled',
      params: { value }
    });
  };

  return (
    <OptionsSection title="Pop Out Mini Player">
      <Switch checked={synqLinkPopupsEnabled} onChange={handleChange}>
        Show pop out button on music services
      </Switch>
    </OptionsSection>
  );
};
