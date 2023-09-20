import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '~store';
import { useSidebarRoot } from '~ui/sidebar/contexts/SidebarRoot';
import { useWindowSize } from '~ui/sidebar/hooks/useWindowSize';

const OFFSET = 325;
const QUEUE_ITEM_HEIGHT = 78;
const SHOW_QUEUE_BREAKPOINT = 560;

export const useControllerScreen = () => {
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

    return Math.max(3, Math.floor(height - OFFSET / QUEUE_ITEM_HEIGHT));
  }, [height, playerState, session]);

  const handleNavigateToSearch = () => {
    navigate('/search');
  };

  const handleNavigateToQueue = () => {
    navigate('/queue');
  };

  return {
    handleNavigateToSearch,
    handleNavigateToQueue,
    listeners,
    sidebarRoot,
    queueDisplayCount,
    shouldDisplayQueue
  };
};
