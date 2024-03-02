import { useEffect } from 'react';

import { sendToBackground } from '~core/messaging';
import type { Event } from '~util/analytics';

interface UseAnalyticsProps extends Event {
  immediate?: boolean;
}

/**
 * React hook to send events to Google Analytics
 */
export const useAnalytic = ({ name, params }: UseAnalyticsProps) => {
  useEffect(() => {
    sendToBackground({
      name: 'SEND_ANALYTICS_EVENT',
      body: {
        name,
        params
      }
    });
  }, [name, params]);
};
