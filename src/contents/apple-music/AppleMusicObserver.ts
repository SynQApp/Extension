import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { ReduxHub } from '~util/connectToReduxHub';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from '../lib/MusicServiceObserver';
import type { AppleMusicController } from './AppleMusicController';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleMusicObserver extends MusicServiceObserver {
  declare _controller: AppleMusicController;
  private _nowPlayingItemDidChangeHandler!: () => void;
  private _playbackStateChangeHandler!: () => void;

  constructor(controller: AppleMusicController, hub: ReduxHub) {
    super(controller, hub);
  }

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        clearInterval(interval);

        /**
         * Create the handlers here so that we can remove it later.
         * Needs to be wrapped this way so that we can use `this`.
         */
        this._nowPlayingItemDidChangeHandler = async () => {
          await this._handleTrackUpdated();
        };

        this._playbackStateChangeHandler = async () => {
          await this._handlePlaybackUpdated();
        };

        /**
         * Add the event listeners.
         */
        this._controller
          .getPlayer()
          .addEventListener(
            'nowPlayingItemDidChange',
            this._nowPlayingItemDidChangeHandler
          );

        playbackStateChangedEvents.forEach((event) => {
          this._controller
            .getPlayer()
            .addEventListener(event, this._playbackStateChangeHandler);
        });
      }
    }, 500);
  }

  public async resume(filter: ObserverStateFilter): Promise<void> {
    super.resume(filter);

    this._handlePlaybackUpdated();
    this._handleTrackUpdated();
  }

  public unobserve(): void {
    this._controller
      .getPlayer()
      .removeEventListener(
        'nowPlayingItemDidChange',
        this._nowPlayingItemDidChangeHandler
      );

    playbackStateChangedEvents.forEach((event) => {
      this._controller
        .getPlayer()
        .removeEventListener(event, this._playbackStateChangeHandler);
    });
  }

  private async _handleTrackUpdated(): Promise<void> {
    super.handleTrackUpdated();

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

    const playerState = this._controller.getPlayerState();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    this._hub.dispatch(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState: playerState ?? undefined
      })
    );
  }
}
