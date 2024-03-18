import type { ContentObserver } from '~core/adapter';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';

import type { YouTubeContentController } from './YouTubeContentController';

export class YouTubeContentObserver implements ContentObserver {
  private _onStateChangeHandler!: () => void;
  private _onVideoDataChangeHandler!: () => void;
  private _mutationObservers: MutationObserver[] = [];

  constructor(private _controller: YouTubeContentController) {}

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        console.log('clearing interval');
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

    const player = this._controller.getPlayer();
    console.log({ player });

    this._controller
      .getPlayer()
      .addEventListener('onStateChange', this._onStateChangeHandler);

    const playerStateObserver = new MutationObserver(async () => {
      await this._handlePlaybackUpdated();
    });

    const progressBarKnobElement = document.querySelector(
      '.ytp-progress-bar-container'
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

    setInterval(async () => {
      console.log('interval');
      await this._handlePlaybackUpdated();
    }, 1000);
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

    const likeButton = document.querySelector(
      '.ytmusic-player-bar #button-shape-like'
    );
    if (likeButton) {
      songInfoObserver.observe(likeButton, {
        attributeFilter: ['aria-pressed']
      });
    }

    const dislikeButton = document.querySelector(
      '.ytmusic-player-bar #button-shape-dislike'
    );
    if (dislikeButton) {
      songInfoObserver.observe(dislikeButton, {
        attributeFilter: ['aria-pressed']
      });
    }
  }

  private async _handleTrackUpdated(): Promise<void> {
    const currentTrack = this._controller.getCurrentTrack();
    updateCurrentTrack(currentTrack);
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = this._controller.getPlayerState();
    console.log({ playerState });
    await updatePlaybackState(playerState);
  }
}
