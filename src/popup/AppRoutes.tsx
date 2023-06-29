import { Route, Routes } from 'react-router-dom';

import ChoosePlatformPage from './screens/ChoosePlatform';
import ControllerPage from './screens/Controller';
import ListenersPage from './screens/Listeners';
import QueuePage from './screens/Queue';
import SearchPage from './screens/Search';
import SettingsPage from './screens/Settings';
import ShareSessionPage from './screens/ShareSession';
import ShareTrackPage from './screens/ShareTrack';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ControllerPage />} />
      <Route path="/choose-platform" element={<ChoosePlatformPage />} />
      <Route path="/listeners" element={<ListenersPage />} />
      <Route path="/queue" element={<QueuePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/share-session" element={<ShareSessionPage />} />
      <Route path="/share-track" element={<ShareTrackPage />} />
    </Routes>
  );
};

export default AppRoutes;
