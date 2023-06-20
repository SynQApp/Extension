import type { YouTubeMusicController } from '~lib/controllers/YouTubeMusicController';
import { mainWorldToBackground } from '~util/mainWorldToBackground';

import type { IObserverEmitter } from './IObserverEmitter';

export class YouTubeMusicObserverEmitter implements IObserverEmitter {
  private _controller: YouTubeMusicController;
  private _onStateChangeHandler: () => void;
  private _onVideoDataChangeHandler: () => void;
  private _mutationObservers: MutationObserver[] = [];

  constructor(controller: YouTubeMusicController) {
    this._controller = controller;
  }

  public observe(): void {
    const interval = setInterval(() => {
      if (this._controller.getPlayer()) {
        console.log('SynQ: Observing player');
        clearInterval(interval);

        this._setupPlayerStateObserver();
        this._setupSongInfoObserver();
        this._setupQueueObserver();
      }
    }, 500);
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

    progressBarKnobElement &&
      playerStateObserver.observe(progressBarKnobElement, {
        attributeFilter: ['value']
      });

    const likeButton = document.querySelector(
      '.ytmusic-like-button-renderer.like'
    );
    likeButton &&
      playerStateObserver.observe(likeButton, {
        attributeFilter: ['aria-pressed']
      });

    const dislikeButton = document.querySelector(
      '.ytmusic-like-button-renderer.dislike'
    );
    dislikeButton &&
      playerStateObserver.observe(dislikeButton, {
        attributeFilter: ['aria-pressed']
      });

    const volumeElement = document.getElementById('volume-slider');
    volumeElement &&
      playerStateObserver.observe(volumeElement, {
        attributeFilter: ['value']
      });

    const repeatButton = document.querySelector('.repeat.ytmusic-player-bar');
    repeatButton &&
      playerStateObserver.observe(repeatButton, {
        attributeFilter: ['aria-label']
      });

    this._mutationObservers.push(playerStateObserver);
  }

  private _setupSongInfoObserver() {
    this._onVideoDataChangeHandler = async () => {
      await this._sendSongInfoUpdatedMessage();
    };

    this._controller
      .getPlayer()
      .addEventListener('videodatachange', this._onVideoDataChangeHandler);
  }

  private _setupQueueObserver() {
    const queueObserver = new MutationObserver(async () => {
      await this._sendQueueUpdatedMessage();
    });

    const queueElement = document.querySelector(
      '#contents.ytmusic-player-queue'
    );

    queueElement &&
      queueObserver.observe(queueElement, {
        childList: true
      });

    this._mutationObservers.push(queueObserver);
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
