import type { ContentObserver } from '~core/adapter';
import { updateCurrentTrack, updatePlaybackState } from '~core/player';
import { waitForElement } from '~util/waitForElement';

import type { SpotifyContentController } from './SpotifyContentController';

export class SpotifyObserver implements ContentObserver {
  constructor(private _controller: SpotifyContentController) {}

  public async observe(): Promise<void> {
    await waitForElement('[data-testid="player-controls"]');

    this._setupPlayerStateObserver();
    await this._setupTrackObserver();
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
  }

  private async _setupTrackObserver() {
    const trackObserver = new MutationObserver(async () => {
      await this._handleTrackUpdated();
    });

    const nowPlayingWidgetSelector = 'div[data-testid="now-playing-widget"]';
    const nowPlayingWidget = await waitForElement(nowPlayingWidgetSelector);
    if (nowPlayingWidget) {
      trackObserver.observe(nowPlayingWidget, {
        childList: true
      });
    }

    const addToLibraryButtonSelector = 'button[data-testid="add-button"]';
    const addToLibraryButton = nowPlayingWidget.querySelector(
      addToLibraryButtonSelector
    );
    if (addToLibraryButton) {
      trackObserver.observe(addToLibraryButton, {
        attributeFilter: ['aria-checked']
      });
    }

    const playPauseButtonElement = document.querySelector(
      'button[data-testid="control-button-playpause"]'
    );
    if (playPauseButtonElement) {
      trackObserver.observe(playPauseButtonElement, {
        attributeFilter: ['aria-label']
      });
    }
  }

  /**
   * The Spotify API can take more time than the mutation observer to update the current
   * song info. This method will update the current track based only on the UI first and
   * then update it again with the API data.
   */
  private async _handleTrackUpdated(): Promise<void> {
    await this._updateCurrentTrack(true);

    setTimeout(async () => {
      await this._updateCurrentTrack();
    }, 5000);
  }

  private async _updateCurrentTrack(partial?: boolean): Promise<void> {
    const currentTrack = await this._controller.getCurrentTrack(partial);
    await updateCurrentTrack(currentTrack);
  }

  private async _handlePlaybackUpdated(): Promise<void> {
    const playerState = await this._controller.getPlayerState();
    await updatePlaybackState(playerState);
  }
}
