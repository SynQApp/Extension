import { useEffect, useState } from 'react';

import {
  ContentEvent,
  EventMessage,
  MusicControllerMessage,
  UiStateMessage
} from '~types';
import { generateRequestId } from '~util/generateRequestId';

export const useDocumentMusicController = <T>(
  initialCommand: MusicControllerMessage,
  eventMessage: EventMessage
) => {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const getInitialState = () => {
      const requestId = generateRequestId();

      const event = new CustomEvent(ContentEvent.TO_CONTENT, {
        detail: {
          requestId,
          body: {
            name: initialCommand,
            body: {
              awaitResponse: true
            }
          }
        }
      });

      window.addEventListener(
        `${ContentEvent.FROM_CONTENT}:${requestId}`,
        (event: CustomEvent) => {
          const newState = event.detail.body;
          setState(newState);
        }
      );

      window.dispatchEvent(event);
    };

    getInitialState();

    const popupEvent = new CustomEvent(ContentEvent.TO_CONTENT, {
      detail: {
        body: {
          name: UiStateMessage.POPUP_OPENED
        }
      }
    });

    window.dispatchEvent(popupEvent);

    const handleMessage = (event: CustomEvent) => {
      const message = event.detail.message;

      if (message.name === eventMessage) {
        setState(message.body);
      }
    };

    window.addEventListener(ContentEvent.TO_BACKGROUND, handleMessage);

    return () => {
      window.removeEventListener(ContentEvent.TO_BACKGROUND, handleMessage);
    };
  }, []);

  return state;
};
