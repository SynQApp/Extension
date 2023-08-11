import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { store } from '~store';

import { ContextProvidersWrapper } from './ContextProvidersWrapper';
import { Sidebar } from './Sidebar';

export const SidebarIndex = () => {
  return (
    <MemoryRouter>
      <Provider store={store}>
        <ContextProvidersWrapper>
          <Sidebar />
        </ContextProvidersWrapper>
      </Provider>
    </MemoryRouter>
  );
};

export default SidebarIndex;
