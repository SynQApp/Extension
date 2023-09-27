// Entry point file for Popup required by Plasmo.

import './ui/popup/index.css';

import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { store } from '~store';

import Popup from './ui/popup/Popup';
import PopupContextProvidersWrapper from './ui/popup/contexts/PopupContextProvidersWrapper';

const PopupIndex = () => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <PopupContextProvidersWrapper>
          <UiProvider>
            <Popup queueCollapsible />
          </UiProvider>
        </PopupContextProvidersWrapper>
      </MemoryRouter>
    </Provider>
  );
};

export default PopupIndex;
