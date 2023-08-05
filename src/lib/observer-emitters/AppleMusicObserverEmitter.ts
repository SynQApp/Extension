import type { AppleMusicController } from '~lib/music-controllers/AppleMusicController';
import { EventMessageType } from '~types/Events';
import { mainWorldToBackground } from '~util/mainWorldToBackground';

import type { IObserverEmitter } from './IObserverEmitter';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleMusicObserverEmitter implements IObserverEmitter {
  private _controller: AppleMusicController;
  private _nowPlayingItemDidChangeHandler: () => void;
  private _playbackStateChangeHandler: () => void;
  private _paused = true;

  constructor(controller: AppleMusicController) {
    this._controller = controller;
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

    await mainWorldToBackground({
      name: EventMessageType.SONG_INFO_UPDATED,
      body: {
        songInfo: this._controller.getCurrentSongInfo()
      }
    });
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    if (this._paused) {
      return;
    }

    await mainWorldToBackground({
      name: EventMessageType.PLAYBACK_UPDATED,
      body: {
        playbackState: this._controller.getPlayerState()
      }
    });
  }
}
