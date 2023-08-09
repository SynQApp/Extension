import type { MusicController } from '~lib/music-controllers/MusicController';
import { ContentEvent, MusicControllerMessage } from '~types';
import { sendMessageResponse } from '~util/sendMessageResponse';

/**
 * Register a controller handler that handles events from other components
 * in the extension.
 */
export const createMusicControllerHandler = (controller: MusicController) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case MusicControllerMessage.PLAY:
          await controller.play();
          break;

        case MusicControllerMessage.PLAY_PAUSE:
          await controller.playPause();
          break;

        case MusicControllerMessage.PAUSE:
          await controller.pause();
          break;

        case MusicControllerMessage.NEXT:
          await controller.next();
          break;

        case MusicControllerMessage.PREVIOUS:
          await controller.previous();
          break;

        case MusicControllerMessage.TOGGLE_LIKE:
          await controller.toggleLike();
          break;

        case MusicControllerMessage.TOGGLE_DISLIKE:
          await controller.toggleDislike();
          break;

        case MusicControllerMessage.TOGGLE_MUTE:
          await controller.toggleMute();
          break;

        case MusicControllerMessage.SET_VOLUME:
          await controller.setVolume(message.body.volume);
          break;

        case MusicControllerMessage.SEEK_TO:
          await controller.seekTo(message.body.time);
          break;

        case MusicControllerMessage.START_TRACK:
          await controller.startTrack(
            message.body.trackId,
            message.body.albumId
          );
          break;

        case MusicControllerMessage.TOGGLE_REPEAT_MODE:
          await controller.toggleRepeatMode();
          break;

        case MusicControllerMessage.PREPARE_FOR_SESSION:
          await controller.prepareForSession();
          break;

        case MusicControllerMessage.PREPARE_FOR_AUTOPLAY:
          await controller.prepareForAutoplay();
          break;

        case MusicControllerMessage.GET_PLAYER_STATE:
          const playerState = await controller.getPlayerState();
          sendMessageResponse(playerState, event.detail.requestId);
          break;

        case MusicControllerMessage.GET_CURRENT_SONG_INFO:
          const currentSongInfo = await controller.getCurrentSongInfo();
          sendMessageResponse(currentSongInfo, event.detail.requestId);
          break;

        case MusicControllerMessage.GET_QUEUE:
          const queue = await controller.getQueue();
          sendMessageResponse(queue, event.detail.requestId);
          break;

        case MusicControllerMessage.PLAY_QUEUE_TRACK:
          await controller.playQueueTrack(
            message.body.trackId,
            message.body.duplicateIndex
          );
          break;

        case MusicControllerMessage.SEARCH_TRACKS:
          const searchResults = await controller.searchTracks(
            message.body.query
          );

          sendMessageResponse(searchResults, event.detail.requestId);

          break;

        default:
          break;
      }
    }
  );
};
