import type { ContentObserver } from '~core/adapter';
import type { ReconnectingHub } from '~core/messaging/hub';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';

import type { AmazonContentController } from './AmazonContentController';

const playbackStateChangedEvents = [
  'playpause',
  'started',
  'ended',
  'timeupdate'
];

export class AmazonMusicObserver implements ContentObserver {
  declare _controller: AmazonContentController;
  private _onStateChangeHandler!: () => void;

  private _currentState: {
    trackId?: string;
    queueIds: string[];
    rating?: string;
    volume?: number;
    repeat?: string;
    isPlaying?: boolean;
  };

  constructor(controller: AmazonContentController) {
    this._controller = controller;
    this._currentState = {
      trackId: undefined,
      queueIds: [],
      rating: undefined,
      volume: undefined,
      repeat: undefined,
      isPlaying: undefined
    };
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

  /**
   * Maestro is the Amazon Music player which has a couple basic events we can listen to
   * for reliable playback state updates.
   */
  private async _setupMaestroObserver() {
    const maestro = await this._controller.getMaestroInstance();

    this._onStateChangeHandler = async () => {
      await this._handlePlaybackUpdated();
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

    if (!store) {
      return;
    }

    store.subscribe(async () => {
      const state = store.getState();

      if (state.Storage?.RATINGS?.TRACK_RATING !== this._currentState.rating) {
        this._currentState.rating = state.Storage?.RATINGS?.TRACK_RATING;
        await this._handleTrackUpdated();
      }

      if (state.Media?.mediaId !== this._currentState.trackId) {
        this._currentState.trackId = state.Media?.mediaId;
        await this._handleTrackUpdated();
      }

      if (state.PlaybackStates?.repeat?.state !== this._currentState.repeat) {
        this._currentState.repeat = state.PlaybackStates?.repeat?.state;
        await this._handlePlaybackUpdated();
      }

      if (state.PlaybackStates?.play?.state !== this._currentState.isPlaying) {
        this._currentState.isPlaying = state.PlaybackStates?.play?.state;
        await this._handlePlaybackUpdated();
        await this._handleTrackUpdated();
      }

      if (maestro.getVolume() !== this._currentState.volume) {
        this._currentState.volume = maestro.getVolume();
        await this._handlePlaybackUpdated();
      }
    });
  }

  private async _handleTrackUpdated(): Promise<void> {
    const maestro = await this._controller.getMaestroInstance();

    // If the audio player is not ready, we can't get the current track yet.
    if (!maestro.getAudioPlayer().getAudioElement()) {
      return;
    }

    const currentTrack = this._controller.getCurrentTrack();
    await updateCurrentTrack(currentTrack);
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = await this._controller.getPlayerState();
    await updatePlaybackState(playerState);
  }
}
