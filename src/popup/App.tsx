import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { store } from '~store';

import AppRoutes from './AppRoutes';
import Layout from './Layout';
import PopupContextProvidersWrapper from './contexts/PopupContextProvidersWrapper';

const App = () => {
  return (
    <MemoryRouter>
      <Provider store={store}>
        <PopupContextProvidersWrapper>
          <UiProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </UiProvider>
        </PopupContextProvidersWrapper>
      </Provider>
    </MemoryRouter>
  );
};

export default App;
