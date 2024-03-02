import { Route, Routes } from 'react-router-dom';

import { AcceptPermissionsScreen } from './screens/AcceptPermissions';
import ControllerScreen from './screens/Controller';
import SelectPlatformScreen from './screens/SelectPlatform';
import SelectTabScreen from './screens/SelectTab';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/accept-permissions" element={<AcceptPermissionsScreen />} />
      <Route path="/select-platform" element={<SelectPlatformScreen />} />
      <Route path="/select-tab" element={<SelectTabScreen />} />
    </Routes>
  );
};

export default AppRoutes;
