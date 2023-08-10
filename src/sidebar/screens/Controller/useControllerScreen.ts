import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExpanded } from '~player-ui/contexts/Expanded';
import { usePlaybackState } from '~player-ui/contexts/PlaybackState';
import { useSidebarRoot } from '~sidebar/contexts/SidebarRoot';
import { useWindowSize } from '~sidebar/hooks/useWindowSize';

const NON_EXPANDED_OFFSET = 325;
const EXPANDED_OFFSET = 530;
const QUEUE_ITEM_HEIGHT = 78;
const SHOW_QUEUE_BREAKPOINT = 560;

export const useControllerScreen = () => {
  const expanded = useExpanded();
  const navigate = useNavigate();
  const { height } = useWindowSize();
  const playbackState = usePlaybackState();
  const sidebarRoot = useSidebarRoot();

  const shouldDisplayQueue = useMemo(() => {
    return height > SHOW_QUEUE_BREAKPOINT;
  }, [height]);

  const queueDisplayCount = useMemo(() => {
    if (!playbackState?.queue?.length) {
      return 0;
    }

    return Math.max(
      3,
      Math.floor(
        (height - (expanded ? EXPANDED_OFFSET : NON_EXPANDED_OFFSET)) /
          QUEUE_ITEM_HEIGHT
      )
    );
  }, [expanded, height, playbackState]);

  const handleNavigateToSearch = () => {
    navigate('/search');
  };

  const handleNavigateToQueue = () => {
    navigate('/queue');
  };

  return {
    expanded,
    handleNavigateToSearch,
    handleNavigateToQueue,
    sidebarRoot,
    queueDisplayCount,
    shouldDisplayQueue
  };
};
