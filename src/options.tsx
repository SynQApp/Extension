// Entry point file for Options required by Plasmo.

import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';

import { store } from '~store';

import { Options } from './ui/options';

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
