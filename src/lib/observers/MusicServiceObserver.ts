import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { MusicController } from '~lib/music-controllers/MusicController';
import type { Track, ValueOrPromise } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';

export enum ObserverEvent {
  TRACK_UPDATED = 'TRACK_UPDATED',
  PLAYER_STATE_UPDATED = 'PLAYER_STATE_UPDATED'
}

type ObserverHandler = (
  message: PlasmoMessaging.Request<ObserverEvent>
) => ValueOrPromise<void>;

export interface ObserverStateFilter {
  tabs?: boolean;
  currentTrack?: boolean;
  playerState?: boolean;
}

export abstract class MusicServiceObserver {
  protected _controller: MusicController;
  protected _hub: ReduxHub;

  private _paused: boolean = true;
  private _pausedProperties: Record<keyof ObserverStateFilter, boolean> = {
    tabs: true,
    currentTrack: true,
    playerState: true
  };
  private _currentTrack: Track = undefined;
  private _lastScrobbledTrackId: string = undefined;
  private _listeners: ObserverHandler[] = [];

  constructor(controller: MusicController, hub: ReduxHub) {
    this._controller = controller;
    this._hub = hub;
  }

  /**
   * Begin observing the music player and emitting events when the state changes.
   */
  public abstract observe(): ValueOrPromise<void>;

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
  public abstract unobserve(): ValueOrPromise<void>;

  /**
   * Subscribe to observer events.
   */
  public subscribe(listener: ObserverHandler): void {
    this._listeners.push(listener);
  }

  protected emit(message: PlasmoMessaging.Request<ObserverEvent>): void {
    this._listeners.forEach((listener) => listener(message));
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

    if (currentTrack?.id === this._currentTrack?.id) {
      return;
    }

    this._currentTrack = currentTrack;

    this.emit({
      name: ObserverEvent.TRACK_UPDATED,
      body: currentTrack
    });
  }
}
