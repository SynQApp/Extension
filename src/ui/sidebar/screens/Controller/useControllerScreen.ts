import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '~store';
import { useExpanded } from '~ui/shared/contexts/Expanded';
import { useSidebarRoot } from '~ui/sidebar/contexts/SidebarRoot';
import { useWindowSize } from '~ui/sidebar/hooks/useWindowSize';

const NON_EXPANDED_OFFSET = 325;
const EXPANDED_OFFSET = 530;
const QUEUE_ITEM_HEIGHT = 78;
const SHOW_QUEUE_BREAKPOINT = 560;

export const useControllerScreen = () => {
  const expanded = useExpanded();
  const navigate = useNavigate();
  const { height } = useWindowSize();
  const playerState = useAppSelector((state) => state.playerState);
  const sidebarRoot = useSidebarRoot();
  const listeners = useAppSelector((state) => state.session?.listeners);
  const session = useAppSelector((state) => state.session);

  const shouldDisplayQueue = useMemo(() => {
    return height > SHOW_QUEUE_BREAKPOINT;
  }, [height]);

  const queueDisplayCount = useMemo(() => {
    if (session && !session?.queue?.length && !playerState?.queue?.length) {
      return 0;
    }

    return Math.max(
      3,
      Math.floor(
        (height - (expanded ? EXPANDED_OFFSET : NON_EXPANDED_OFFSET)) /
          QUEUE_ITEM_HEIGHT
      )
    );
  }, [expanded, height, playerState, session]);

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
    listeners,
    sidebarRoot,
    queueDisplayCount,
    shouldDisplayQueue
  };
};
