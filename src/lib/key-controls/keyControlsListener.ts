import { MusicControllerMessage } from '~types';
import { sendMessage } from '~util/sendMessage';

export interface KeyControlsOptions {
  playPause?: boolean;
  next?: boolean;
  previous?: boolean;
  volumeUp?: boolean;
  volumeDown?: boolean;
}

let keyControlsListener: (event: KeyboardEvent) => void;

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
          sendMessage({
            name: MusicControllerMessage.PLAY_PAUSE
          });
        }
        break;
      case 'ArrowRight':
        if (keyControlsOptions.next) {
          sendMessage({
            name: MusicControllerMessage.NEXT
          });
        }
        break;
      case 'ArrowLeft':
        if (keyControlsOptions.previous) {
          sendMessage({
            name: MusicControllerMessage.PREVIOUS
          });
        }
        break;
      case 'ArrowUp':
        if (keyControlsOptions.volumeUp) {
          sendMessage({
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
          sendMessage({
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
