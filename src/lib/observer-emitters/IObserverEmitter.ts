import type { ValueOrPromise } from '~types';

/**
 * Observer emitters are responsible for observing the state of the music player
 * and emitting events when the state changes.
 */
export interface ObserverEmitter {
  /**
   * Begin observing the music player and emitting events when the state changes.
   */
  observe(): ValueOrPromise<void>;

  /**
   * Pause emitting events.
   */
  pause(): ValueOrPromise<void>;

  /**
   * Resume emitting events.
   */
  resume(): ValueOrPromise<void>;

  /**
   * Stop observing the music player. Remove all listeners.
   */
  unobserve(): ValueOrPromise<void>;
}
