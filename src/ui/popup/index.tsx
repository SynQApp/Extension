import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { POPUP_PORT } from '~constants/port';
import {
  addKeyControlsListener,
  removeKeyControlsListener
} from '~lib/key-controls/keyControlsListener';
import { useAppSelector } from '~store';
import { TabsMessage } from '~types/TabsMessage';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';
import { sendMessage } from '~util/sendMessage';

import AppRoutes from './PopupRoutes';

const App = () => {
  const navigate = useNavigate();
  const tabs = useAppSelector((state) => state.musicServiceTabs);
  const settings = useAppSelector((state) => state.settings);
  const { musicServiceTab: selectedTab } = useMusicServiceTab();

  useEffect(() => {
    chrome.runtime.connect({ name: POPUP_PORT });

    // Then request the current tabs to be updated in the store
    sendMessage({
      name: TabsMessage.UPDATE_TAB
    });
  }, []);

  useEffect(() => {
    if (!settings?.miniPlayerKeyControlsEnabled) {
      return;
    }

    addKeyControlsListener({
      playPause: true,
      next: true,
      previous: true,
      volumeUp: true,
      volumeDown: true
    });

    return () => {
      removeKeyControlsListener();
    };
  }, [settings]);

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
