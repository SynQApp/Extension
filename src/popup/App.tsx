import { UiProvider } from '@synq/ui';
import { MemoryRouter } from 'react-router-dom';

import { ContextProvidersWrapper } from '~player-ui/contexts/ContextProvidersWrapper';

import AppRoutes from './AppRoutes';
import Layout from './Layout';

const App = () => {
  return (
    <MemoryRouter>
      <ContextProvidersWrapper>
        <UiProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </UiProvider>
      </ContextProvidersWrapper>
    </MemoryRouter>
  );
};

export default App;
