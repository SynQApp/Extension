import { useState } from 'react';

const useControllerScreen = () => {
  const [showQueue, setShowQueue] = useState(false);

  return {
    showQueue,
    setShowQueue
  };
};

export default useControllerScreen;
