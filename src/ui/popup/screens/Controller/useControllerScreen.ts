import { useState } from 'react';

import adapters from '~adapters';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

const useControllerScreen = () => {
  const [showQueue, setShowQueue] = useState(false);
  const { musicServiceTab } = useMusicServiceTab();

  const queueDisabled = adapters
    .find((adapter) => adapter.id === musicServiceTab?.musicService)
    ?.disabledFeatures?.includes('queue');

  return {
    queueDisabled,
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
