import { useEffect } from 'react';

/**
 * Removes the scrollbar from the body and prevents scrolling while SynQ is open.
 */
export const usePreventBodyScroll = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const htmlElement = document.documentElement;

    document.body.style.overflow = 'hidden';
    htmlElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      htmlElement.style.overflow = 'auto';
    };
  }, [enabled]);
};
