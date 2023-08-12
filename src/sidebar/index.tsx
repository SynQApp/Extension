import { MemoryRouter } from 'react-router-dom';

import { Sidebar } from './Sidebar';

export const SidebarIndex = () => {
  return (
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
};

export default SidebarIndex;
