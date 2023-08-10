import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExpanded } from '~player-ui/contexts/Expanded';
import { useMusicService } from '~player-ui/contexts/MusicService';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useTabs } from '~player-ui/contexts/Tabs';
import { AutoplayMessage, MusicService } from '~types';

const LIKE_ENABLED_SERVICES = new Set([
  MusicService.AMAZON_MUSIC,
  MusicService.SPOTIFY,
  MusicService.YOUTUBE_MUSIC
]);

const DISLIKE_ENABLED_SERVICES = new Set([
  MusicService.AMAZON_MUSIC,
  MusicService.YOUTUBE_MUSIC
]);

const useControllerScreen = () => {
  const expanded = useExpanded();
  const { allTabs, loading: tabsLoading } = useTabs();
  const navigate = useNavigate();
  const playbackState = usePlaybackState();
  const { sendMessage } = useMusicService();

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (tabsLoading) {
      return;
    }

    if (!allTabs || allTabs.length === 0) {
      navigate('/select-platform');
    } else if (allTabs.length > 1) {
      navigate('/select-tab');
    }
  }, [tabsLoading]);

  useEffect(() => {
    const checkAutoplayReady = async () => {
      const res = await sendMessage({
        name: AutoplayMessage.CHECK_AUTOPLAY_READY,
        body: {
          awaitResponse: true
        }
      });

      if (res?.ready === false) {
        navigate('/enable-autoplay');
      }
    };

    checkAutoplayReady();
  }, [sendMessage]);

  const queueCount = useMemo(
    () => playbackState?.queue?.length ?? 0,
    [playbackState]
  );

  return {
    expanded,
    queueCount,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
