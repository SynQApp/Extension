import type { AppleMusicController } from '~lib/controllers/AppleMusicController';
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
  private _queueItemsDidChangeHandler: () => void;

  constructor(controller: AppleMusicController) {
    this._controller = controller;
  }

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        console.log('SynQ: Observing player');
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

        this._queueItemsDidChangeHandler = async () => {
          await this._sendQueueUpdatedMessage();
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

        this._controller
          .getPlayer()
          .addEventListener(
            'queueItemsDidChange',
            this._queueItemsDidChangeHandler
          );
      }
    }, 500);
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

    this._controller
      .getPlayer()
      .removeEventListener(
        'queueItemsDidChange',
        this._queueItemsDidChangeHandler
      );
  }

  private async _sendSongInfoUpdatedMessage(): Promise<void> {
    await mainWorldToBackground({
      name: 'SONG_INFO_UPDATED',
      body: {
        songInfo: this._controller.getPlayerState().songInfo
      }
    });
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    await mainWorldToBackground({
      name: 'PLAYBACK_UPDATED',
      body: {
        playback: this._controller.getPlayerState()
      }
    });
  }

  private async _sendQueueUpdatedMessage(): Promise<void> {
    await mainWorldToBackground({
      name: 'QUEUE_UPDATED',
      body: {
        queue: this._controller.getQueue()
      }
    });
  }
}
