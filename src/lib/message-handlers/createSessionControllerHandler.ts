import type { SessionController } from '~lib/session/SessionController';
import { ContentEvent, SessionControllerMessage } from '~types';
import { sendMessageResponse } from '~util/sendMessageResponse';

/**
 * Register a message handler for the SessionController.
 */
export const createMusicControllerHandler = (controller: SessionController) => {
  window.addEventListener(
    ContentEvent.TO_CONTENT,
    async (event: CustomEvent) => {
      const message = event.detail.body;

      switch (message.name) {
        case SessionControllerMessage.END_SESSION:
          controller.endSession();
          break;

        case SessionControllerMessage.LOCK_SESSION:
          controller.lockSession();
          break;

        case SessionControllerMessage.UNLOCK_SESSION:
          controller.unlockSession();
          break;

        case SessionControllerMessage.KICK_LISTENER:
          controller.kickListener(message.body.listenerId);
          break;

        case SessionControllerMessage.GET_LISTENERS:
          const listeners = controller.getListeners();
          sendMessageResponse(listeners, event.detail.requestId);
          break;

        case SessionControllerMessage.GET_SESSION_DETAILS:
          const sessionDetails = controller.getSessionDetails();
          sendMessageResponse(sessionDetails, event.detail.requestId);
          break;

        case SessionControllerMessage.TOGGLE_SESSION_REPEAT_MODE:
          controller.toggleSessionRepeatMode();
          break;

        case SessionControllerMessage.UPDATE_SESSION_QUEUE_ITEM_POSITION:
          controller.updateSessionQueueItemPosition(
            message.body.queueItemId,
            message.body.index
          );
          break;

        case SessionControllerMessage.REMOVE_SESSION_QUEUE_ITEM:
          controller.removeSessionQueueItem(message.body.queueItemId);
          break;

        case SessionControllerMessage.ADD_SESSION_QUEUE_ITEM:
          controller.addSessionQueueItem(message.body.queueItem);
          break;

        case SessionControllerMessage.GET_SESSION_QUEUE:
          const sessionQueue = controller.getSessionQueue();
          sendMessageResponse(sessionQueue, event.detail.requestId);
          break;

        default:
          break;
      }
    }
  );
};
