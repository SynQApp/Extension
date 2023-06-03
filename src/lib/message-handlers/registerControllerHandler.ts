import type { IController } from '~lib/controllers/IController';

enum ControllerMessageType {
  PLAY = 'PLAY',
  PLAY_PAUSE = 'PLAY_PAUSE',
  PAUSE = 'PAUSE',
  NEXT = 'NEXT',
  PREVIOUS = 'PREVIOUS',
  SET_SHUFFLE = 'SET_SHUFFLE',
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  SET_VOLUME = 'SET_VOLUME',
  SEEK_TO = 'SEEK_TO',
  START_TRACK = 'START_TRACK'
}

export const registerControllerHandler = (controller: IController) => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

      case ControllerMessageType.SET_SHUFFLE:
        controller.setShuffle(message.body.shuffle);
        break;

      case ControllerMessageType.LIKE:
        controller.like();
        break;

      case ControllerMessageType.DISLIKE:
        controller.dislike();
        break;

      case ControllerMessageType.SET_VOLUME:
        controller.setVolume(message.body.volume);
        break;

      case ControllerMessageType.SEEK_TO:
        controller.seekTo(message.body.time);
        break;

      case ControllerMessageType.START_TRACK:
        controller.startTrack(message.body.trackId);
        break;

      default:
        break;
    }
  });
};
