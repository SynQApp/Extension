import type { AppleMusicController } from '~lib/music-controllers/AppleMusicController';
import { setCurrentTrack } from '~store/slices/currentTrack';
import { setPlayerState } from '~store/slices/playerState';
import type { ReduxHub } from '~util/connectToReduxHub';

import type { ObserverEmitter } from './IObserverEmitter';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleMusicObserverEmitter implements ObserverEmitter {
  private _controller: AppleMusicController;
  private _hub: ReduxHub;
  private _nowPlayingItemDidChangeHandler: () => void;
  private _playbackStateChangeHandler: () => void;
  private _paused = true;

  constructor(controller: AppleMusicController, hub: ReduxHub) {
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

  public pause(): void {
    this._paused = true;
  }

  public resume(): void {
    this._paused = false;

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

    const playerState = this._controller.getPlayerState();
    this._hub.dispatch(setPlayerState(playerState));
  }
}
