import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';

const SidebarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
    </Routes>
  );
};

export default SidebarRoutes;
