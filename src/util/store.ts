import type { Action } from 'redux';

import { sendToBackground } from '~core/messaging';

export const dispatchFromContent = (action: Action) => {
  sendToBackground({ name: 'DISPATCH', body: action });
};
