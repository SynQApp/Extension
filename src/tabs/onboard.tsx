import { UiProvider } from '@synqapp/ui';
import { Provider } from 'react-redux';

import { store } from '~store';
import { Onboard } from '~ui/onboard/Onboard';

const OnboardPage = () => {
  return (
    <UiProvider>
      <Provider store={store}>
        <Onboard />
      </Provider>
    </UiProvider>
  );
};

export default OnboardPage;
