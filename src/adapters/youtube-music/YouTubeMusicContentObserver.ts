import type { ContentObserver } from '~core/adapter';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';

import type { YouTubeMusicContentController } from './YouTubeMusicContentController';
import {
  LIKE_STATE_ATTRIBUTE_FILTER,
  getLikeStateObserverTargets
} from './likeStatus';

export class YouTubeMusicObserver implements ContentObserver {
  private _onStateChangeHandler!: () => void;
  private _onVideoDataChangeHandler!: () => void;
  private _mutationObservers: MutationObserver[] = [];

  constructor(private _controller: YouTubeMusicContentController) {}

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        clearInterval(interval);

        this._setupPlayerStateObserver();
        this._setupSongInfoObserver();
      }
    }, 500);
  }

  private _setupPlayerStateObserver() {
    this._onStateChangeHandler = async () => {
      await this._handlePlaybackUpdated();
    };

    this._controller
      .getPlayer()
      .addEventListener('onStateChange', this._onStateChangeHandler);

    const playerStateObserver = new MutationObserver(async () => {
      await this._handlePlaybackUpdated();
    });

    const progressBarKnobElement = document.querySelector(
      '#progress-bar #sliderKnob .slider-knob-inner'
    );
    if (progressBarKnobElement) {
      playerStateObserver.observe(progressBarKnobElement, {
        attributeFilter: ['value']
      });
    }

    const volumeElement = document.getElementById('volume-slider');
    if (volumeElement) {
      playerStateObserver.observe(volumeElement, {
        attributeFilter: ['value']
      });
    }

    const repeatButton = document.querySelector('.repeat.ytmusic-player-bar');
    if (repeatButton) {
      playerStateObserver.observe(repeatButton, {
        attributeFilter: ['aria-label']
      });
    }

    this._mutationObservers.push(playerStateObserver);
  }

  private _setupSongInfoObserver() {
    this._onVideoDataChangeHandler = async () => {
      await this._handleTrackUpdated();
    };

    this._controller
      .getPlayer()
      .addEventListener('videodatachange', this._onVideoDataChangeHandler);

    const songInfoObserver = new MutationObserver(async () => {
      await this._handleTrackUpdated();
    });

    // `subtree` matters here: YouTube Music may carry `aria-pressed` on the
    // wrapper or on the inner `<button>`, and observing only the wrapper means
    // no mutations fire when it lives on the child. See likeStatus.ts.
    for (const target of getLikeStateObserverTargets()) {
      songInfoObserver.observe(target, {
        attributes: true,
        attributeFilter: LIKE_STATE_ATTRIBUTE_FILTER,
        subtree: true
      });
    }

    this._mutationObservers.push(songInfoObserver);
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
