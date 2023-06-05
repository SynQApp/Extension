import type { IController } from '~lib/controllers/IController';
import { ControllerMessageType } from '~types/ControllerMessageType';

export const registerControllerHandler = (controller: IController) => {
  window.addEventListener('SynQEvent:Receive', async (event: CustomEvent) => {
    const message = event.detail.message;

    console.log('Received message', message);

    switch (message.type) {
      case ControllerMessageType.PLAY:
        console.log('play');
        controller.play();
        break;

      case ControllerMessageType.PLAY_PAUSE:
        console.log('playPause');
        controller.playPause();
        break;

      case ControllerMessageType.PAUSE:
        console.log('pause');
        controller.pause();
        break;

      case ControllerMessageType.NEXT:
        console.log('next');
        controller.next();
        break;

      case ControllerMessageType.PREVIOUS:
        console.log('previous');
        controller.previous();
        break;

      case ControllerMessageType.TOGGLE_SHUFFLE:
        console.log('toggleShuffle');
        controller.toggleShuffle();
        break;

      case ControllerMessageType.TOGGLE_LIKE:
        console.log('toggleLike');
        controller.toggleLike();
        break;

      case ControllerMessageType.TOGGLE_DISLIKE:
        console.log('toggleDislike');
        controller.toggleDislike();
        break;

      case ControllerMessageType.SET_VOLUME:
        console.log('setVolume');
        controller.setVolume(message.body.volume);
        break;

      case ControllerMessageType.SEEK_TO:
        console.log('seekTo');
        controller.seekTo(message.body.time);
        break;

      case ControllerMessageType.START_TRACK:
        console.log('startTrack');
        controller.startTrack(message.body.trackId);
        break;

      case ControllerMessageType.PREPARE_FOR_SESSION:
        console.log('prepareForSession');
        await controller.prepareForSession();
        break;

      default:
        break;
    }
  });
};
