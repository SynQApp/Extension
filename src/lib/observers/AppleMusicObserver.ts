import type { AppleMusicController } from '~lib/music-controllers/AppleMusicController';
import { setCurrentTrack } from '~store/slices/currentTrack';
import { updateMusicServiceTabPreview } from '~store/slices/musicServiceTabs';
import { setPlayerState } from '~store/slices/playerState';
import type { ReduxHub } from '~util/connectToReduxHub';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from './MusicServiceObserver';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleMusicObserver extends MusicServiceObserver {
  private _controller: AppleMusicController;
  private _hub: ReduxHub;
  private _nowPlayingItemDidChangeHandler: () => void;
  private _playbackStateChangeHandler: () => void;

  constructor(controller: AppleMusicController, hub: ReduxHub) {
    super();

    this._controller = controller;
    this._hub = hub;
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
          await this._sendSongInfoUpdatedMessage();
        };

        this._playbackStateChangeHandler = async () => {
          await this._sendPlaybackUpdatedMessage();
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

  public resume(filter: ObserverStateFilter): void {
    super.resume(filter);

    this._sendPlaybackUpdatedMessage();
    this._sendSongInfoUpdatedMessage();
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

  private async _sendSongInfoUpdatedMessage(): Promise<void> {
    if (this.isPaused()) {
      return;
    }

    const currentTrack = this._controller.getCurrentTrack();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    if (!this.isPaused('tabs')) {
      this._hub.dispatch(
        updateMusicServiceTabPreview({
          tabId: tab.id,
          preview: currentTrack
        })
      );
    }

    if (!this.isPaused('currentTrack')) {
      this._hub.dispatch(setCurrentTrack(currentTrack));
    }
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    if (this.isPaused('playerState')) {
      return;
    }

    const playerState = this._controller.getPlayerState();
    this._hub.dispatch(setPlayerState(playerState));
  }
}
