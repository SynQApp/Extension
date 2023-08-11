import { UiProvider } from '@synq/ui';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { TabsProvider } from '~player-ui/contexts/Tabs';
import { store } from '~store';

import AppRoutes from './AppRoutes';
import Layout from './Layout';
import PopupContextProvidersWrapper from './contexts/PopupContextProvidersWrapper';
import { useTabs } from './hooks/useTabs';

const App = () => {
  const tabs = useTabs();

  return (
    <MemoryRouter>
      <Provider store={store}>
        <TabsProvider value={tabs}>
          <PopupContextProvidersWrapper>
            <UiProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </UiProvider>
          </PopupContextProvidersWrapper>
        </TabsProvider>
      </Provider>
    </MemoryRouter>
  );
};

export default App;
