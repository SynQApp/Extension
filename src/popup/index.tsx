import { MemoryRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import Layout from './Layout';

import './index.css';

import { ContextProvidersWrapper } from './contexts/ContextProvidersWrapper';

const Popup = () => {
  return (
    <MemoryRouter>
      <ContextProvidersWrapper>
        <Layout>
          <AppRoutes />
        </Layout>
      </ContextProvidersWrapper>
    </MemoryRouter>
  );
};

export default Popup;
