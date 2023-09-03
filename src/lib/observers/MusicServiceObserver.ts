import type { MusicController } from '~lib/music-controllers/MusicController';
import type { ValueOrPromise } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

export interface ObserverStateFilter {
  tabs?: boolean;
  currentTrack?: boolean;
  playerState?: boolean;
}

export class MusicServiceObserver {
  protected _controller: MusicController;
  protected _hub: ReduxHub;

  private _paused: boolean = true;
  private _pausedProperties: Record<keyof ObserverStateFilter, boolean> = {
    tabs: true,
    currentTrack: true,
    playerState: true
  };
  private _currentTrackId: string = undefined;

  constructor(controller: MusicController, hub: ReduxHub) {
    this._controller = controller;
    this._hub = hub;
  }

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
      this._pausedProperties = {
        ...this._pausedProperties,
        ...filter
      };
    } else {
      this._paused = true;
      this._pausedProperties = {
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

      this._pausedProperties = {
        ...this._pausedProperties,
        ...newPausedState
      };
    } else {
      this._paused = false;
      this._pausedProperties = {
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
      return this._paused;
    }

    return this._pausedProperties[key];
  }

  protected async handleTrackUpdated(): Promise<void> {
    const currentTrack = await this._controller.getCurrentTrack();

    if (currentTrack?.id === this._currentTrackId) {
      return;
    }

    this._hub.postMessage({
      name: 'TRACK_CHANGED',
      body: currentTrack
    });

    this._currentTrackId = currentTrack?.id;
  }
}
