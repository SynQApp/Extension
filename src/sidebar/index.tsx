import { MemoryRouter } from 'react-router-dom';

import { MarqueeStylesProvider } from '~player-ui/styles/MarqueeStylesProvider';

import { Sidebar } from './Sidebar';

export const SidebarIndex = () => {
  return (
    <MemoryRouter>
      <MarqueeStylesProvider>
        <Sidebar />
      </MarqueeStylesProvider>
    </MemoryRouter>
  );
};

export default SidebarIndex;
