import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentSongInfo } from '~player-ui/contexts/CurrentSongInfo';
import { useExpanded } from '~player-ui/contexts/Expanded';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useTabs } from '~player-ui/contexts/Tabs';
import { useMusicService } from '~player-ui/hooks/useMusicService';
import { AutoplayMessage } from '~types/AutoplayMessage';
import { MusicControllerMessage } from '~types/MusicControllerMessage';
import { MusicService } from '~types/MusicService';

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
  const { allTabs, loading: tabsLoading, sendToTab } = useTabs();
  const currentSongInfo = useCurrentSongInfo();
  const navigate = useNavigate();
  const playbackState = usePlaybackState();
  const musicService = useMusicService();

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
      const res = await sendToTab({
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
  }, [sendToTab]);

  const handleLikeClick = LIKE_ENABLED_SERVICES.has(musicService)
    ? () => {
        sendToTab({
          name: MusicControllerMessage.TOGGLE_LIKE
        });
      }
    : undefined;

  const handleDislikeClick = DISLIKE_ENABLED_SERVICES.has(musicService)
    ? () => {
        sendToTab({
          name: MusicControllerMessage.TOGGLE_DISLIKE
        });
      }
    : undefined;

  const queueCount = useMemo(
    () => playbackState?.queue?.length ?? 0,
    [playbackState]
  );

  return {
    currentSongInfo,
    expanded,
    handleDislikeClick,
    handleLikeClick,
    queueCount,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
