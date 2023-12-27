import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  addKeyControlsListener,
  removeKeyControlsListener
} from '~shared/keyControlsListener';
import { useAppSelector } from '~store';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

import AppRoutes from './PopupRoutes';
import { usePopupSettings } from './contexts/PopupSettingsContext';

const Popup = () => {
  const navigate = useNavigate();
  const tabs = useAppSelector((state) => state.musicServiceTabs);
  const settings = useAppSelector((state) => state.settings);
  const popupSettings = usePopupSettings();
  const { musicServiceTab: selectedTab } = useMusicServiceTab();

  useEffect(() => {
    if (
      !settings?.miniPlayerKeyControlsEnabled ||
      !popupSettings?.keyControls
    ) {
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

export default Popup;
