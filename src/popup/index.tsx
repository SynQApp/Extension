import './index.css';

import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { store } from '~store';

import App from './App';
import PopupContextProvidersWrapper from './contexts/PopupContextProvidersWrapper';

const Popup = () => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <PopupContextProvidersWrapper>
          <UiProvider>
            <App />
          </UiProvider>
        </PopupContextProvidersWrapper>
      </MemoryRouter>
    </Provider>
  );
};

export default Popup;
