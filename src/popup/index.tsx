import { UiProvider } from '@synq/ui';
import { MemoryRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import Layout from './Layout';
import { ContextProvidersWrapper } from './contexts/ContextProvidersWrapper';

import './index.css';

const Popup = () => {
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

export default Popup;
