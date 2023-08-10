import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';
import QueueScreen from './screens/Queue';
import SearchScreen from './screens/Search';
import SessionScreen from './screens/Session';

const SidebarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/queue" element={<QueueScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path="/session" element={<SessionScreen />} />
    </Routes>
  );
};

export default SidebarRoutes;
