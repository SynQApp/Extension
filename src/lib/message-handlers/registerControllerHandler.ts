import type { IController } from '~lib/controllers/IController';
import { ControllerMessageType } from '~types/ControllerMessageType';
import { RepeatMode } from '~types/RepeatMode';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const registerControllerHandler = (controller: IController) => {
  window.addEventListener('SynQEvent:Receive', async (event: CustomEvent) => {
    const message = event.detail.message;

    switch (message.type) {
      case ControllerMessageType.PLAY:
        controller.play();
        break;

      case ControllerMessageType.PLAY_PAUSE:
        controller.playPause();
        break;

      case ControllerMessageType.PAUSE:
        controller.pause();
        break;

      case ControllerMessageType.NEXT:
        controller.next();
        break;

      case ControllerMessageType.PREVIOUS:
        controller.previous();
        break;

      case ControllerMessageType.TOGGLE_SHUFFLE:
        controller.setRepeatMode(RepeatMode.NO_REPEAT);
        break;

      case ControllerMessageType.TOGGLE_LIKE:
        controller.toggleLike();
        break;

      case ControllerMessageType.TOGGLE_DISLIKE:
        controller.toggleDislike();
        break;

      case ControllerMessageType.SET_VOLUME:
        controller.setVolume(message.body.volume);
        break;

      case ControllerMessageType.SEEK_TO:
        controller.seekTo(message.body.time);
        break;

      case ControllerMessageType.START_TRACK:
        await controller.startTrack(message.body.trackId, message.body.albumId);
        break;

      case ControllerMessageType.SET_REPEAT_MODE:
        controller.setRepeatMode(message.body.repeatMode);
        break;

      case ControllerMessageType.PREPARE_FOR_SESSION:
        await controller.prepareForSession();
        break;

      default:
        break;
    }
  });
};
