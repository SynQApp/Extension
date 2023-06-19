import type { IController } from '~lib/controllers/IController';

/**
 * Observer emitters are responsible for observing the state of the music player
 * and emitting events when the state changes.
 */
export interface IObserverEmitter {
  /**
   * Begin observing the music player and emitting events when the state changes.
   */
  observe(): void;

  /**
   * Stop observing the music player. Remove all listeners.
   */
  unobserve(): void;
}
