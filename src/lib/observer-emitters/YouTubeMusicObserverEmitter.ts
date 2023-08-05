import type { YouTubeMusicController } from '~lib/music-controllers/YouTubeMusicController';
import { EventMessageType } from '~types/Events';
import { mainWorldToBackground } from '~util/mainWorldToBackground';

import type { IObserverEmitter } from './IObserverEmitter';

export class YouTubeMusicObserverEmitter implements IObserverEmitter {
  private _controller: YouTubeMusicController;
  private _onStateChangeHandler: () => void;
  private _onVideoDataChangeHandler: () => void;
  private _mutationObservers: MutationObserver[] = [];
  private _paused = true;

  constructor(controller: YouTubeMusicController) {
    this._controller = controller;
  }

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        clearInterval(interval);

        this._setupPlayerStateObserver();
        this._setupSongInfoObserver();
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
      .removeEventListener('onStateChange', this._onStateChangeHandler);

    this._controller
      .getPlayer()
      .removeEventListener('videodatachange', this._onVideoDataChangeHandler);

    this._mutationObservers.forEach((observer) => observer.disconnect());
  }

  private _setupPlayerStateObserver() {
    this._onStateChangeHandler = async () => {
      await this._sendPlaybackUpdatedMessage();
    };

    this._controller
      .getPlayer()
      .addEventListener('onStateChange', this._onStateChangeHandler);

    const playerStateObserver = new MutationObserver(async () => {
      await this._sendPlaybackUpdatedMessage();
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
      await this._sendSongInfoUpdatedMessage();
    };

    this._controller
      .getPlayer()
      .addEventListener('videodatachange', this._onVideoDataChangeHandler);

    const songInfoObserver = new MutationObserver(async () => {
      await this._sendSongInfoUpdatedMessage();
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
