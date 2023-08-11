import { MemoryRouter } from 'react-router-dom';

import { ContextProvidersWrapper } from './ContextProvidersWrapper';
import { Sidebar } from './Sidebar';

export const SidebarIndex = () => {
  return (
    <MemoryRouter>
      <ContextProvidersWrapper>
        <Sidebar />
      </ContextProvidersWrapper>
    </MemoryRouter>
  );
};

export default SidebarIndex;
