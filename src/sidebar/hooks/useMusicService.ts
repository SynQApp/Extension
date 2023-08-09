import { useMemo } from 'react';

import type { MusicServiceContextValue } from '~player-ui/contexts/MusicService';
import { ContentEvent } from '~types';
import { getMusicServiceFromUrl } from '~util/musicService';

export const useMusicService = () => {
  const musicService = useMemo(
    () =>
      window.location?.href
        ? getMusicServiceFromUrl(window.location.href)
        : null,
    []
  );

  const sendMessage = async (message: any) => {
    const event = new CustomEvent(ContentEvent.TO_CONTENT, {
      detail: {
        body: message
      }
    });

    window.dispatchEvent(event);
  };

  const musicServiceValue: MusicServiceContextValue = {
    sendMessage,
    musicService
  };

  return musicServiceValue;
};
