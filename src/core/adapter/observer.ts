import type { ValueOrPromise } from '~types';

export interface ContentObserver {
  /**
   * Begin observing the music player and emitting updates on change.
   */
  observe(): ValueOrPromise<void>;
}
