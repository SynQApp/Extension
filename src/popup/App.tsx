import { UiProvider } from '@synq/ui';
import { MemoryRouter } from 'react-router-dom';

import { TabsProvider } from '~player-ui/contexts/Tabs';

import AppRoutes from './AppRoutes';
import Layout from './Layout';
import PopupContextProvidersWrapper from './contexts/PopupContextProvidersWrapper';
import { useTabs } from './hooks/useTabs';

const App = () => {
  const tabs = useTabs();

  return (
    <MemoryRouter>
      <TabsProvider value={tabs}>
        <PopupContextProvidersWrapper>
          <UiProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </UiProvider>
        </PopupContextProvidersWrapper>
      </TabsProvider>
    </MemoryRouter>
  );
};

export default App;
