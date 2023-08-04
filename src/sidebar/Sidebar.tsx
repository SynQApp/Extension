import { token } from '@synq/ui';
import { MemoryRouter } from 'react-router-dom';
import { styled } from 'styled-components';

import { ExpandedProvider } from '~player-ui/contexts/Expanded';

import Layout from './Layout';
import SidebarRoutes from './Routes';

export const Sidebar = () => {
  return (
    <MemoryRouter>
      <ExpandedProvider expanded={false}>
        <SidebarContainer>
          <Layout>
            <SidebarRoutes />
          </Layout>
        </SidebarContainer>
      </ExpandedProvider>
    </MemoryRouter>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  height: 100vh;
  width: 350px;
  position: fixed;
  top: 0;
  right: 0;
  background: ${token('colors.background')};
`;
