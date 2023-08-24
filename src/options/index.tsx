import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';

import { store } from '~store';

import { Options } from './Options';

const OptionsIndex = () => {
  return (
    <UiProvider>
      <Provider store={store}>
        <Options />
      </Provider>
    </UiProvider>
  );
};

export default OptionsIndex;
