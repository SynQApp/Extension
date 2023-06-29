import type { AmazonMusicController } from '~lib/controllers/AmazonMusicController';
import { mainWorldToBackground } from '~util/mainWorldToBackground';

import type { IObserverEmitter } from './IObserverEmitter';

const playbackStateChangedEvents = [
  'playpause',
  'started',
  'ended',
  'timeupdate'
];

export class AmazonMusicObserverEmitter implements IObserverEmitter {
  private _controller: AmazonMusicController;
  private _onStateChangeHandler: () => void;
  private _queueObserverInterval: NodeJS.Timer;
  private _unsubscribeStoreObserver: () => void;

  private _currentState: {
    trackId: string;
    queueIds: string[];
    rating: string;
    volume: number;
    repeat: string;
  };

  constructor(controller: AmazonMusicController) {
    this._controller = controller;
    this._currentState = {
      trackId: undefined,
      queueIds: [],
      rating: undefined,
      volume: undefined,
      repeat: undefined
    };
  }

  public observe(): void {
    const maestroInterval = setInterval(async () => {
      if (await this._controller.getMaestroInstance()) {
        console.log('SynQ: Observing player');
        clearInterval(maestroInterval);

        this._setupMaestroObserver();

        // The store observer also requires the maestro instance to be ready,
        // so we nest the store observer setup inside the maestro observer setup.
        const storeInterval = setInterval(async () => {
          if (this._controller.getStore()) {
            console.log('SynQ: Observing store');
            clearInterval(storeInterval);

            this._setupStoreObserver();
          }
        }, 500);
      }
    }, 500);
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

    this._onStateChangeHandler = async () => {
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
      const state = store.getState();

      if (state.Storage?.RATINGS?.TRACK_RATING !== this._currentState.rating) {
        this._currentState.rating = state.Storage.RATINGS.TRACK_RATING;
        await this._sendSongInfoUpdatedMessage();
      }

      if (state.Media?.mediaId !== this._currentState.trackId) {
        this._currentState.trackId = state.Media.mediaId;
        await this._sendSongInfoUpdatedMessage();
      }

      if (state.PlaybackStates?.repeat?.state !== this._currentState.repeat) {
        this._currentState.repeat = state.PlaybackStates.repeat.state;
        await this._sendPlaybackUpdatedMessage();
      }

      if (maestro.getVolume() !== this._currentState.volume) {
        this._currentState.volume = maestro.getVolume();
        await this._sendPlaybackUpdatedMessage();
      }
    });
  }

  private async _sendSongInfoUpdatedMessage(): Promise<void> {
    await mainWorldToBackground({
      name: 'SONG_INFO_UPDATED',
      body: {
        songInfo: this._controller.getCurrentSongInfo()
      }
    });
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    await mainWorldToBackground({
      name: 'PLAYBACK_UPDATED',
      body: {
        playback: await this._controller.getPlayerState()
      }
    });
  }
}