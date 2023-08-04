import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';
import EnableAutoplayScreen from './screens/EnableAutoplay';
import SelectPlatformScreen from './screens/SelectPlatform';
import SelectTabScreen from './screens/SelectTab';
import SettingsScreen from './screens/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/enable-autoplay" element={<EnableAutoplayScreen />} />
      <Route path="/select-platform" element={<SelectPlatformScreen />} />
      <Route path="/select-tab" element={<SelectTabScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
};

export default AppRoutes;
