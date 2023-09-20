import { Route, Routes } from 'react-router-dom';

import QueueScreen from './screens/main/QueueScreen';

export const PlayerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<QueueScreen />} />
    </Routes>
  );
};
