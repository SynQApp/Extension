import type { ContentObserver } from '~core/adapter';
import type { ReconnectingHub } from '~core/messaging/hub';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';

import type { AppleContentController } from './AppleContentController';

const playbackStateChangedEvents = [
  'playbackStateDidChange',
  'playbackTimeDidChange',
  'playbackDurationDidChange',
  'playbackProgressDidChange',
  'playbackVolumeDidChange',
  'repeatModeDidChange'
];

export class AppleObserver implements ContentObserver {
  private _nowPlayingItemDidChangeHandler!: () => void;
  private _playbackStateChangeHandler!: () => void;

  public constructor(private _controller: AppleContentController) {}

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

  private async _handleTrackUpdated(): Promise<void> {
    const currentTrack = this._controller.getCurrentTrack();
    updateCurrentTrack(currentTrack);
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = this._controller.getPlayerState();
    await updatePlaybackState(playerState);
  }
}
