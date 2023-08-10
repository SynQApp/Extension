import { useMemo } from 'react';

import type { MusicServiceContextValue } from '~player-ui/contexts/MusicService';
import { ContentEvent } from '~types';
import { generateRequestId } from '~util/generateRequestId';
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
    return new Promise((resolve, reject) => {
      const requestId = generateRequestId();
      const event = new CustomEvent(ContentEvent.TO_CONTENT, {
        detail: {
          requestId,
          body: message
        }
      });

      if (message?.body?.awaitResponse) {
        window.addEventListener(
          `${ContentEvent.FROM_CONTENT}:${requestId}`,
          (event: CustomEvent) => {
            resolve(event.detail.body);
          }
        );
      }

      window.dispatchEvent(event);
    });
  };

  const musicServiceValue: MusicServiceContextValue = {
    sendMessage,
    musicService
  };

  return musicServiceValue;
};
