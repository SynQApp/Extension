import wait from 'waait';

import type { SpotifyController } from '~lib/music-controllers/SpotifyController';
import { setCurrentTrack } from '~store/slices/currentTrack';
import { updateMusicServiceTabPreview } from '~store/slices/musicServiceTabs';
import { setPlayerState } from '~store/slices/playerState';
import type { ReduxHub } from '~util/connectToReduxHub';
import { waitForElement } from '~util/waitForElement';

import {
  MusicServiceObserver,
  type ObserverStateFilter
} from './MusicServiceObserver';

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
    const playbackProgressBarInput = playbackProgressBarElement.querySelector(
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
    const volumeInputElement = volumeContainerElement.querySelector(
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

  private _getNowPlayingText() {
    const nowPlayingWidget = document.querySelector(
      'div[data-testid="now-playing-widget"]'
    );
    return nowPlayingWidget?.getAttribute('aria-label') ?? '';
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
    super.handleTrackUpdated();

    const nowPlayingText = this._getNowPlayingText();

    if (this.isPaused()) {
      return;
    }

    for (let i = 0; i < 5; i++) {
      const songInfo = await this._controller.getCurrentTrack();

      if (!nowPlayingText.includes(songInfo.name)) {
        await wait(1000);
        continue;
      }

      const currentTrack = await this._controller.getCurrentTrack();

      const tab = await this._hub.asyncPostMessage<chrome.tabs.Tab>({
        name: 'GET_SELF_TAB'
      });

      if (!this.isPaused('tabs')) {
        this._hub.dispatch(
          updateMusicServiceTabPreview({
            tabId: tab.id,
            preview: currentTrack
          })
        );
      }

      if (!this.isPaused('currentTrack')) {
        this._hub.dispatch(setCurrentTrack(currentTrack));
      }

      return;
    }
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    if (this.isPaused('playerState')) {
      return;
    }

    const playerState = await this._controller.getPlayerState();
    const action = setPlayerState(playerState);
    this._hub.dispatch(action);
  }
}
