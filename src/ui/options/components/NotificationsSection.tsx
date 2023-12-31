import { Switch } from '@synq/ui';

import { useAppDispatch, useAppSelector } from '~store';
import { setNotificationsEnabled } from '~store/slices/settings';
import { sendAnalytic } from '~util/analytics';

import { OptionsSection } from './OptionsSection';

export const NotificationsSection = () => {
  const notificationsEnabled = useAppSelector(
    (state) => state.settings.notificationsEnabled
  );
  const dispatch = useAppDispatch();

  const handleChange = (value: boolean) => {
    dispatch(setNotificationsEnabled(value));
    sendAnalytic({
      name: 'notifications_enabled',
      params: { value }
    });
  };

  return (
    <OptionsSection title="Notifications">
      <Switch checked={notificationsEnabled} onChange={handleChange}>
        Allow notifications on song change
      </Switch>
    </OptionsSection>
  );
};
