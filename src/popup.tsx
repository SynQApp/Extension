// Entry point file for Popup required by Plasmo.

import './ui/popup/index.css';

import { UiProvider } from '@synqapp/ui';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { POPUP_PORT } from '~constants/port';
import { store } from '~store';

import Popup from './ui/popup/Popup';
import PopupContextProvidersWrapper from './ui/popup/contexts/PopupContextProvidersWrapper';

const PopupIndex = () => {
  useEffect(() => {
    chrome.runtime.connect({ name: POPUP_PORT });
  }, []);

  return (
    <Provider store={store}>
      <MemoryRouter>
        <PopupContextProvidersWrapper>
          <UiProvider>
            <Popup />
          </UiProvider>
        </PopupContextProvidersWrapper>
      </MemoryRouter>
    </Provider>
  );
};

export default PopupIndex;
