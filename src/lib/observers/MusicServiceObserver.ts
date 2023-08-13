import type { ValueOrPromise } from '~types';

export interface ObserverStateFilter {
  tabs?: boolean;
  currentTrack?: boolean;
  playerState?: boolean;
}

/**
 * Observer emitters are responsible for observing the state of the music player
 * and emitting events when the state changes.
 */
// export interface MusicServiceObserver {
//   /**
//    * Begin observing the music player and emitting events when the state changes.
//    */
//   observe(): ValueOrPromise<void>;

//   /**
//    * Pause updating state. If a filter is provided, the observer will only pause
//    * updating the state for the specified properties.
//    */
//   pause(filter?: ObserverStateFilter): ValueOrPromise<void>;

//   /**
//    * Resume updating state. If a filter is provided, the observer will only
//    * resume updating the state for the specified properties.
//    */
//   resume(filter?: ObserverStateFilter): ValueOrPromise<void>;

//   /**
//    * Stop observing the music player. Remove all listeners.
//    */
//   unobserve(): ValueOrPromise<void>;
// }

export class MusicServiceObserver {
  private paused: boolean = true;
  private pausedProperties: Record<keyof ObserverStateFilter, boolean> = {
    tabs: true,
    currentTrack: true,
    playerState: true
  };

  /**
   * Begin observing the music player and emitting events when the state changes.
   */
  public observe(): ValueOrPromise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Pause updating state. If a filter is provided, the observer will only pause
   * updating the state for the specified properties.
   */
  public pause(filter?: ObserverStateFilter): ValueOrPromise<void> {
    if (filter) {
      this.pausedProperties = {
        ...this.pausedProperties,
        ...filter
      };
    } else {
      this.paused = true;
      this.pausedProperties = {
        tabs: true,
        currentTrack: true,
        playerState: true
      };
    }
  }

  /**
   * Resume updating state. If a filter is provided, the observer will only
   * resume updating the state for the specified properties.
   */
  public resume(filter?: ObserverStateFilter): ValueOrPromise<void> {
    if (filter) {
      // Remove any filter properties that are false
      Object.keys(filter).forEach((key) => {
        if (!filter[key]) {
          delete filter[key];
        }
      });

      // Flip each of the provided true filter to false
      const newPausedState = Object.keys(filter).reduce((acc, key) => {
        acc[key] = !filter[key];
        return acc;
      }, {});

      this.pausedProperties = {
        ...this.pausedProperties,
        ...newPausedState
      };
    } else {
      this.paused = false;
      this.pausedProperties = {
        tabs: false,
        currentTrack: false,
        playerState: false
      };
    }
  }

  /**
   * Stop observing the music player. Remove all listeners.
   */
  public unobserve(): ValueOrPromise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Returns true if the specified key is paused.
   */
  protected isPaused(key?: keyof ObserverStateFilter): boolean {
    if (!key) {
      return this.paused;
    }

    return this.pausedProperties[key];
  }
}
