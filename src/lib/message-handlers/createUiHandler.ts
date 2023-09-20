import { UiStateMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

export const createUiHandler = (hub: ReduxHub) => {
  hub.addListener(async (message) => {
    switch (message?.name) {
      case UiStateMessage.SIDEBAR_OPENED:
        document.body.style.overflow = 'hidden';
        break;

      case UiStateMessage.SIDEBAR_CLOSED:
        document.body.style.overflow = 'auto';
        break;
    }
  });
};
