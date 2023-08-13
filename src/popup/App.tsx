import { useEffect } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { POPUP_PORT } from '~constants/port';
import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import { useAppDispatch, useAppSelector } from '~store';
import { clearMusicServiceTabs } from '~store/slices/musicServiceTabs';
import { TabsMessage } from '~types/TabsMessage';
import { sendMessage } from '~util/sendMessage';

import AppRoutes from './AppRoutes';
import Layout from './Layout';

const App = () => {
  const navigate = useNavigate();
  const tabs = useAppSelector((state) => state.musicServiceTabs);
  const { musicServiceTab: selectedTab } = useMusicServiceTab();

  useEffect(() => {
    chrome.runtime.connect({ name: POPUP_PORT });

    // Clear previous persisted tabs list on popup open
    // dispatch(clearMusicServiceTabs());

    // Then request the current tabs to be updated in the store
    sendMessage({
      name: TabsMessage.UPDATE_TAB
    });
  }, []);

  useEffect(() => {
    if (selectedTab) {
      navigate('/');
    } else if (!tabs || tabs.length === 0) {
      navigate('/select-platform');
    } else if (tabs.length > 1) {
      navigate('/select-tab');
    }
  }, [tabs.length, selectedTab]);

  return <AppRoutes />;
};

export default App;
