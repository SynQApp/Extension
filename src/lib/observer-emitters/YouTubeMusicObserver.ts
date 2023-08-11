import type { YouTubeMusicController } from '~lib/music-controllers/YouTubeMusicController';
import { setCurrentTrack } from '~store/slices/currentTrack';
import { updateMusicServiceTabPreview } from '~store/slices/musicServiceTabs';
import { setPlayerState } from '~store/slices/playerState';
import type { ReduxHub } from '~util/connectToReduxHub';

import type { MusicServiceObserver } from './MusicServiceObserver';

export class YouTubeMusicObserver implements MusicServiceObserver {
  private _controller: YouTubeMusicController;
  private _hub: ReduxHub;
  private _onStateChangeHandler: () => void;
  private _onVideoDataChangeHandler: () => void;
  private _mutationObservers: MutationObserver[] = [];
  private _paused = true;

  constructor(controller: YouTubeMusicController, hub: ReduxHub) {
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

    const currentTrack = this._controller.getCurrentTrack();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    this._hub.dispatch(
      updateMusicServiceTabPreview({
        tabId: tab.id,
        preview: currentTrack
      })
    );

    if (window._SYNQ_SELECTED_TAB) {
      this._hub.dispatch(setCurrentTrack(currentTrack));
    }
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    if (this._paused || !window._SYNQ_SELECTED_TAB) {
      return;
    }

    const playerState = this._controller.getPlayerState();
    this._hub.dispatch(setPlayerState(playerState));
  }
}
