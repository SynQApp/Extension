import type { SessionController } from '~lib/session/SessionController';
import { SessionControllerMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

/**
 * Register a message handler for the SessionController.
 */
export const createMusicControllerHandler = (
  controller: SessionController,
  hub: ReduxHub
) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
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

      case SessionControllerMessage.TOGGLE_SESSION_REPEAT_MODE:
        controller.toggleSessionRepeatMode();
        break;

      case SessionControllerMessage.UPDATE_SESSION_QUEUE_ITEM_POSITION:
        controller.updateSessionQueueItemPosition(
          message.body.sourceIndex,
          message.body.destinationIndex
        );
        break;

      case SessionControllerMessage.REMOVE_SESSION_QUEUE_ITEM:
        controller.removeSessionQueueItem(message.body.queueItemId);
        break;

      case SessionControllerMessage.ADD_SESSION_QUEUE_ITEM:
        controller.addSessionQueueItem(message.body.queueItem);
        break;

      default:
        break;
    }
  });
};
