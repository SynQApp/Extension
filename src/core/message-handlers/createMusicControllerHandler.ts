import type { ReconnectingHub } from '~core/messaging/hub';
import { setSearchLoading, setSearchResults } from '~store/slices/search';
import { MusicControllerMessage } from '~types';

import type { MusicServicePlaybackController } from '../../../services/MusicServicePlaybackController';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const createMusicControllerHandler = (
  controller: MusicServicePlaybackController,
  hub: ReconnectingHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case MusicControllerMessage.PLAY: {
        await controller.play();
        break;
      }

      case MusicControllerMessage.PLAY_PAUSE: {
        await controller.playPause();
        break;
      }

      case MusicControllerMessage.PAUSE: {
        await controller.pause();
        break;
      }

      case MusicControllerMessage.NEXT: {
        await controller.next();
        break;
      }

      case MusicControllerMessage.PREVIOUS: {
        await controller.previous();
        break;
      }

      case MusicControllerMessage.TOGGLE_LIKE: {
        await controller.toggleLike();
        break;
      }

      case MusicControllerMessage.TOGGLE_DISLIKE: {
        await controller.toggleDislike();
        break;
      }

      case MusicControllerMessage.TOGGLE_MUTE: {
        await controller.toggleMute();
        break;
      }

      case MusicControllerMessage.SET_VOLUME: {
        await controller.setVolume(message.body.volume, message.body.relative);
        break;
      }

      case MusicControllerMessage.SEEK_TO: {
        await controller.seekTo(message.body.time);
        break;
      }

      case MusicControllerMessage.TOGGLE_REPEAT_MODE: {
        await controller.toggleRepeatMode();
        break;
      }

      case MusicControllerMessage.PREPARE_FOR_AUTOPLAY: {
        await controller.prepareForAutoplay();
        break;
      }

      case MusicControllerMessage.PLAY_QUEUE_TRACK: {
        await controller.playQueueTrack(
          message.body.trackId,
          message.body.duplicateIndex
        );
        break;
      }

      default: {
        break;
      }
    }
  });
};
