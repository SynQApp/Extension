import wait from 'waait';

import {
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} from '~store/slices/musicServiceTabs';
import type { ReduxHub } from '~util/connectToReduxHub';
import { waitForElement } from '~util/waitForElement';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from '../MusicServiceObserver';
import type { SpotifyController } from './SpotifyController';

export class SpotifyObserver extends MusicServiceObserver {
  declare _controller: SpotifyController;
  private _mutationObservers: MutationObserver[] = [];

  constructor(controller: SpotifyController, hub: ReduxHub) {
    super(controller, hub);

    this._controller = controller;
    this._hub = hub;
  }

  public async observe(): Promise<void> {
    await waitForElement('.player-controls');

    this._setupPlayerStateObserver();
    await this._setupSongInfoObserver();
  }

  public resume(filter: ObserverStateFilter): void {
    super.resume(filter);

    this._handlePlaybackUpdated();
    this._handleTrackUpdated();
  }

  public unobserve(): void {
    this._mutationObservers.forEach((observer) => observer.disconnect());
  }

  private _setupPlayerStateObserver() {
    const playerStateObserver = new MutationObserver(async () => {
      await this._handlePlaybackUpdated();
    });

    const playPauseButtonElement = document.querySelector(
      'button[data-testid="control-button-playpause"]'
    );
    if (playPauseButtonElement) {
      playerStateObserver.observe(playPauseButtonElement, {
        attributeFilter: ['aria-label']
      });
    }

    const playbackProgressBarElement = document.querySelector(
      'div[data-testid="playback-progressbar"]'
    );
    const playbackProgressBarInput = playbackProgressBarElement?.querySelector(
      'input[type="range"]'
    );
    if (playbackProgressBarInput) {
      playerStateObserver.observe(playbackProgressBarInput, {
        attributeFilter: ['value']
      });
    }

    const volumeContainerElement = document.querySelector(
      'div[data-testid="volume-bar"]'
    );
    const volumeInputElement = volumeContainerElement?.querySelector(
      'input[type="range"]'
    );
    if (volumeInputElement) {
      playerStateObserver.observe(volumeInputElement, {
        attributeFilter: ['value']
      });
    }

    const repeatButton = document.querySelector(
      'button[data-testid="control-button-repeat"]'
    );
    if (repeatButton) {
      playerStateObserver.observe(repeatButton, {
        attributeFilter: ['aria-label']
      });
    }

    this._mutationObservers.push(playerStateObserver);
  }

  private async _setupSongInfoObserver() {
    const songInfoObserver = new MutationObserver(async () => {
      await this._handleTrackUpdated();
    });

    const nowPlayingWidgetSelector = 'div[data-testid="now-playing-widget"]';
    const nowPlayingWidget = await waitForElement(nowPlayingWidgetSelector);
    if (nowPlayingWidget) {
      songInfoObserver.observe(nowPlayingWidget, {
        attributeFilter: ['aria-label']
      });
    }

    const addToLibraryButtonSelector = 'button[data-testid="add-button"]';
    const addToLibraryButton = nowPlayingWidget.querySelector(
      addToLibraryButtonSelector
    );
    if (addToLibraryButton) {
      songInfoObserver.observe(addToLibraryButton, {
        attributeFilter: ['aria-checked']
      });
    }

    this._mutationObservers.push(songInfoObserver);
  }

  /**
   * The Spotify API can take more time than the mutation observer to update the current
   * song info. This method will retry up to 5 times to get the current song info that
   * matches the UI's song info.
   */
  private async _handleTrackUpdated(): Promise<void> {
    if (this.isPaused()) {
      super.handleTrackUpdated();
      return;
    }

    await this._updateCurrentTrack();

    setTimeout(async () => {
      await this._updateCurrentTrack();
    }, 5000);

    super.handleTrackUpdated();
  }

  private async _updateCurrentTrack(): Promise<void> {
    const currentTrack = await this._controller.getCurrentTrack();

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

    const playerState = await this._controller.getPlayerState();

    const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
      name: 'GET_SELF_TAB'
    });

    this._hub.dispatch(
      updateMusicServiceTabPlayerState({
        tabId: tab.id!,
        playerState: playerState ?? undefined
      })
    );
  }
}
