import type { ContentObserver } from '~core/adapter';
import { sendToBackground } from '~core/messaging';
import type { ReconnectingHub } from '~core/messaging/hub';
import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import { dispatchFromContent } from '~util/store';

import type { YouTubeMusicContentController } from './YouTubeMusicContentController';

export class YouTubeMusicObserver implements ContentObserver {
  private _onStateChangeHandler!: () => void;
  private _onVideoDataChangeHandler!: () => void;
  private _mutationObservers: MutationObserver[] = [];

  constructor(
    private _controller: YouTubeMusicContentController,
    private _hub: ReconnectingHub
  ) {}

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

    const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    dispatchFromContent(
      updateMusicServiceTabCurrentTrack({
        tabId: tab.id!,
        currentTrack: currentTrack ?? undefined
      })
    );
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const tab = await sendToBackground<undefined, chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    const playerState = this._controller.getPlayerState();

    dispatchFromContent(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState: playerState ?? undefined
      })
    );
  }
}
