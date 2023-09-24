import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { ReduxHub } from '~util/connectToReduxHub';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from '../lib/MusicServiceObserver';
import type { YouTubeMusicController } from './YouTubeMusicController';

export class YouTubeMusicObserver extends MusicServiceObserver {
  declare _controller: YouTubeMusicController;
  private _onStateChangeHandler!: () => void;
  private _onVideoDataChangeHandler!: () => void;
  private _mutationObservers: MutationObserver[] = [];

  constructor(controller: YouTubeMusicController, hub: ReduxHub) {
    super(controller, hub);

    this._controller = controller;
    this._hub = hub;
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

  public resume(filter: ObserverStateFilter): void {
    super.resume(filter);

    this._handlePlaybackUpdated();
    this._handleTrackUpdated();
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
    super.handleTrackUpdated();

    if (this.isPaused()) {
      return;
    }

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

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    const playerState = this._controller.getPlayerState();

    this._hub.dispatch(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState: playerState ?? undefined
      })
    );
  }
}
