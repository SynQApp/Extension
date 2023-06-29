import { MemoryRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import Layout from './Layout';

import './index.css';

const Popup = () => {
  return (
    <MemoryRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </MemoryRouter>
  );
};

export default Popup;
