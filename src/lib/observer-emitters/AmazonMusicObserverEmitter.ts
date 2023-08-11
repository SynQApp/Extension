import type { AmazonMusicController } from '~lib/music-controllers/AmazonMusicController';
import { setCurrentTrack } from '~store/slices/currentTrack';
import { setPlayerState } from '~store/slices/playerState';
import { EventMessage } from '~types';
import type { ReduxHub } from '~util/connectToReduxHub';
import { mainWorldToBackground } from '~util/mainWorldToBackground';

import type { ObserverEmitter } from './IObserverEmitter';

const playbackStateChangedEvents = [
  'playpause',
  'started',
  'ended',
  'timeupdate'
];

export class AmazonMusicObserverEmitter implements ObserverEmitter {
  private _controller: AmazonMusicController;
  private _hub: ReduxHub;
  private _onStateChangeHandler: () => void;
  private _queueObserverInterval: NodeJS.Timer;
  private _unsubscribeStoreObserver: () => void;
  private _paused = true;

  private _currentState: {
    trackId: string;
    queueIds: string[];
    rating: string;
    volume: number;
    repeat: string;
    isPlaying: boolean;
  };

  constructor(controller: AmazonMusicController, hub: ReduxHub) {
    this._controller = controller;
    this._currentState = {
      trackId: undefined,
      queueIds: [],
      rating: undefined,
      volume: undefined,
      repeat: undefined,
      isPlaying: undefined
    };
    this._hub = hub;
  }

  public observe(): void {
    const maestroInterval = setInterval(async () => {
      if (await this._controller.getMaestroInstance()) {
        clearInterval(maestroInterval);

        this._setupMaestroObserver();

        // The store observer also requires the maestro instance to be ready,
        // so we nest the store observer setup inside the maestro observer setup.
        const storeInterval = setInterval(async () => {
          if (this._controller.getStore()) {
            clearInterval(storeInterval);

            this._setupStoreObserver();
          }
        }, 500);
      }
    }, 500);
  }

  public pause(): void {
    this._paused = true;
  }

  public resume(): void {
    this._paused = false;
  }

  public async unobserve(): Promise<void> {
    const maestro = await this._controller.getMaestroInstance();

    playbackStateChangedEvents.forEach((event) => {
      maestro.removeEventListener(event, this._onStateChangeHandler);
    });

    clearInterval(this._queueObserverInterval);

    this._unsubscribeStoreObserver();
  }

  /**
   * Maestro is the Amazon Music player which has a couple basic events we can listen to
   * for reliable playback state updates.
   */
  private async _setupMaestroObserver() {
    const maestro = await this._controller.getMaestroInstance();

    this._onStateChangeHandler = async (...params) => {
      await this._sendPlaybackUpdatedMessage();
    };

    playbackStateChangedEvents.forEach((event) => {
      maestro.addEventListener(event, this._onStateChangeHandler);
    });
  }

  /**
   * For everything Maestro doesn't send events for, we can subscribe to the application
   * state changes using the store to observe changes, including current track, ratings,
   * and volume.
   */
  private async _setupStoreObserver() {
    const store = this._controller.getStore();
    const maestro = await this._controller.getMaestroInstance();

    this._unsubscribeStoreObserver = store.subscribe(async () => {
      if (this._paused) {
        return;
      }

      const state = store.getState();

      if (state.Storage?.RATINGS?.TRACK_RATING !== this._currentState.rating) {
        this._currentState.rating = state.Storage?.RATINGS?.TRACK_RATING;
        await this._sendSongInfoUpdatedMessage();
      }

      if (state.Media?.mediaId !== this._currentState.trackId) {
        this._currentState.trackId = state.Media?.mediaId;
        await this._sendSongInfoUpdatedMessage();
      }

      if (state.PlaybackStates?.repeat?.state !== this._currentState.repeat) {
        this._currentState.repeat = state.PlaybackStates?.repeat?.state;
        await this._sendPlaybackUpdatedMessage();
      }

      if (state.PlaybackStates?.play?.state !== this._currentState.isPlaying) {
        this._currentState.isPlaying = state.PlaybackStates?.play?.state;
        await this._sendPlaybackUpdatedMessage();
      }

      if (maestro.getVolume() !== this._currentState.volume) {
        this._currentState.volume = maestro.getVolume();
        await this._sendPlaybackUpdatedMessage();
      }
    });
  }

  private async _sendSongInfoUpdatedMessage(): Promise<void> {
    if (this._paused) {
      return;
    }

    const currentTrack = this._controller.getCurrentSongInfo();
    this._hub.dispatch(setCurrentTrack(currentTrack));
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    if (this._paused) {
      return;
    }

    const playerState = await this._controller.getPlayerState();
    this._hub.dispatch(setPlayerState(playerState));
  }
}
