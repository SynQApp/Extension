import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';
import EnableAutoplayScreen from './screens/EnableAutoplay';
import SelectPlatformScreen from './screens/SelectPlatform';
import SelectTabScreen from './screens/SelectTab';

interface AppRoutesProps {
  queueCollapsible: boolean;
}

const AppRoutes = ({ queueCollapsible }: AppRoutesProps) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ControllerScreen queueCollapsible={queueCollapsible} />}
      />
      <Route path="/enable-autoplay" element={<EnableAutoplayScreen />} />
      <Route path="/select-platform" element={<SelectPlatformScreen />} />
      <Route path="/select-tab" element={<SelectTabScreen />} />
    </Routes>
  );
};

export default AppRoutes;
