import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';
import EnableAutoplayScreen from './screens/EnableAutoplay';
import SelectPlatformScreen from './screens/SelectPlatform';
import SelectTabScreen from './screens/SelectTab';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/enable-autoplay" element={<EnableAutoplayScreen />} />
      <Route path="/select-platform" element={<SelectPlatformScreen />} />
      <Route path="/select-tab" element={<SelectTabScreen />} />
    </Routes>
  );
};

export default AppRoutes;
