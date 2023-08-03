import { Route, Routes } from 'react-router-dom';

import ControllerScreen from './screens/Controller';
import EnableAutoplayScreen from './screens/EnableAutoplay';
import ListenersScreen from './screens/Listeners';
import QueueScreen from './screens/Queue';
import SearchScreen from './screens/Search';
import SelectPlatformScreen from './screens/SelectPlatform';
import SelectTabScreen from './screens/SelectTab';
import SettingsScreen from './screens/Settings';
import ShareSessionScreen from './screens/ShareSession';
import ShareTrackScreen from './screens/ShareTrack';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/listeners" element={<ListenersScreen />} />
      <Route path="/enable-autoplay" element={<EnableAutoplayScreen />} />
      <Route path="/queue" element={<QueueScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path="/select-platform" element={<SelectPlatformScreen />} />
      <Route path="/select-tab" element={<SelectTabScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/share-session" element={<ShareSessionScreen />} />
      <Route path="/share-track" element={<ShareTrackScreen />} />
    </Routes>
  );
};

export default AppRoutes;
