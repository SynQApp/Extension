import { Route, Routes } from 'react-router-dom';

import ChoosePlatformScreen from './screens/ChoosePlatform';
import ControllerScreen from './screens/Controller';
import ListenersScreen from './screens/Listeners';
import QueueScreen from './screens/Queue';
import SearchScreen from './screens/Search';
import SettingsScreen from './screens/Settings';
import ShareSessionScreen from './screens/ShareSession';
import ShareTrackScreen from './screens/ShareTrack';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerScreen />} />
      <Route path="/choose-platform" element={<ChoosePlatformScreen />} />
      <Route path="/listeners" element={<ListenersScreen />} />
      <Route path="/queue" element={<QueueScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/share-session" element={<ShareSessionScreen />} />
      <Route path="/share-track" element={<ShareTrackScreen />} />
    </Routes>
  );
};

export default AppRoutes;
