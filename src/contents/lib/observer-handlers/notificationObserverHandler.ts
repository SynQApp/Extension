import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { Track } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

import { ObserverEvent } from '../MusicServiceObserver';

export const createNotificationObserverHandler =
  (hub: ReduxHub) =>
  async (message: PlasmoMessaging.Request<ObserverEvent>) => {
    if (message.name !== ObserverEvent.TRACK_UPDATED) {
      return;
    }

    const currentTrack = message.body as Track;

    hub.postMessage({
      name: 'CREATE_TRACK_NOTIFICATION',
      body: currentTrack
    });
  };
