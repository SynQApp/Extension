import type { IController } from '~lib/controllers/IController';
import { ControllerMessageType } from '~types/ControllerMessageType';
import { generateRequestId } from '~util/generateRequestId';

const sendResponse = (response: any, requestId: string) => {
  window.dispatchEvent(
    new CustomEvent(`SynQEvent:FromContent:${requestId}`, {
      detail: {
        requestId: generateRequestId(),
        body: response
      }
    })
  );
};

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const registerControllerHandler = (controller: IController) => {
  window.addEventListener('SynQEvent:ToContent', async (event: CustomEvent) => {
    const message = event.detail.body;

    switch (message.name) {
      case ControllerMessageType.PLAY:
        await controller.play();
        break;

      case ControllerMessageType.PLAY_PAUSE:
        await controller.playPause();
        break;

      case ControllerMessageType.PAUSE:
        await controller.pause();
        break;

      case ControllerMessageType.NEXT:
        await controller.next();
        break;

      case ControllerMessageType.PREVIOUS:
        await controller.previous();
        break;

      case ControllerMessageType.TOGGLE_LIKE:
        await controller.toggleLike();
        break;

      case ControllerMessageType.TOGGLE_DISLIKE:
        await controller.toggleDislike();
        break;

      case ControllerMessageType.SET_VOLUME:
        await controller.setVolume(message.body.volume);
        break;

      case ControllerMessageType.SEEK_TO:
        await controller.seekTo(message.body.time);
        break;

      case ControllerMessageType.START_TRACK:
        await controller.startTrack(message.body.trackId, message.body.albumId);
        break;

      case ControllerMessageType.TOGGLE_REPEAT_MODE:
        await controller.toggleRepeatMode();
        break;

      case ControllerMessageType.PREPARE_FOR_SESSION:
        await controller.prepareForSession();
        break;

      case ControllerMessageType.GET_PLAYER_STATE:
        const playerState = await controller.getPlayerState();
        sendResponse(playerState, event.detail.requestId);
        break;

      case ControllerMessageType.GET_CURRENT_SONG_INFO:
        const currentSongInfo = await controller.getCurrentSongInfo();
        sendResponse(currentSongInfo, event.detail.requestId);
        break;

      case ControllerMessageType.GET_QUEUE:
        const queue = await controller.getQueue();
        sendResponse(queue, event.detail.requestId);
        break;

      default:
        break;
    }
  });
};
