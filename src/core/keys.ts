import { sendToContent } from '~core/messaging/sendToContent';
import { MusicControllerMessage } from '~types';

export interface KeyControlsOptions {
  playPause?: boolean;
  next?: boolean;
  previous?: boolean;
  volumeUp?: boolean;
  volumeDown?: boolean;
}

let keyControlsListener: ((event: KeyboardEvent) => void) | undefined;

export const addKeyControlsListener = (
  keyControlsOptions: KeyControlsOptions
) => {
  if (keyControlsListener) {
    return;
  }

  keyControlsListener = (event) => {
    const { key } = event;

    switch (key) {
      case ' ':
        if (keyControlsOptions.playPause) {
          sendToContent({
            name: MusicControllerMessage.PLAY_PAUSE
          });
        }
        break;
      case 'ArrowRight':
        if (keyControlsOptions.next) {
          sendToContent({
            name: MusicControllerMessage.NEXT
          });
        }
        break;
      case 'ArrowLeft':
        if (keyControlsOptions.previous) {
          sendToContent({
            name: MusicControllerMessage.PREVIOUS
          });
        }
        break;
      case 'ArrowUp':
        if (keyControlsOptions.volumeUp) {
          sendToContent({
            name: MusicControllerMessage.SET_VOLUME,
            body: {
              relative: true,
              volume: 10
            }
          });
        }
        break;
      case 'ArrowDown':
        if (keyControlsOptions.volumeDown) {
          sendToContent({
            name: MusicControllerMessage.SET_VOLUME,
            body: {
              relative: true,
              volume: -10
            }
          });
        }
        break;
    }
  };

  document.addEventListener('keydown', keyControlsListener);
};

export const removeKeyControlsListener = () => {
  if (!keyControlsListener) {
    return;
  }

  document.removeEventListener('keydown', keyControlsListener);
  keyControlsListener = undefined;
};
