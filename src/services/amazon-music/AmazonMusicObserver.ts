import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { ReduxHub } from '~util/connectToReduxHub';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from '../MusicServiceObserver';
import type { AmazonMusicController } from './AmazonMusicController';

const playbackStateChangedEvents = [
  'playpause',
  'started',
  'ended',
  'timeupdate'
];

export class AmazonMusicObserver extends MusicServiceObserver {
  declare _controller: AmazonMusicController;
  private _onStateChangeHandler!: () => void;
  private _queueObserverInterval!: NodeJS.Timer;
  private _unsubscribeStoreObserver!: () => void;

  private _currentState: {
    trackId?: string;
    queueIds: string[];
    rating?: string;
    volume?: number;
    repeat?: string;
    isPlaying?: boolean;
  };

  constructor(controller: AmazonMusicController, hub: ReduxHub) {
    super(controller, hub);

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

  public resume(filter?: ObserverStateFilter): void {
    super.resume(filter);

    this._handlePlaybackUpdated();
    this._handleTrackUpdated();
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

    this._unsubscribeStoreObserver = store.subscribe(async () => {
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
      }

      if (maestro.getVolume() !== this._currentState.volume) {
        this._currentState.volume = maestro.getVolume();
        await this._handlePlaybackUpdated();
      }
    });
  }

  private async _handleTrackUpdated(): Promise<void> {
    super.handleTrackUpdated();

    if (this.isPaused()) {
      return;
    }

    const currentTrack = this._controller.getCurrentTrack();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    if (!this.isPaused('currentTrack')) {
      this._hub.dispatch(
        updateMusicServiceTabCurrentTrack({
          tabId: tab.id!,
          currentTrack: currentTrack ?? undefined
        })
      );
    }
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    if (this.isPaused('playerState')) {
      return;
    }

    const playerState = await this._controller.getPlayerState();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    this._hub.dispatch(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState
      })
    );
  }
}
