import wait from 'waait';

import type { SpotifyController } from '~lib/controllers/SpotifyController';
import { EventMessageType } from '~types/Events';
import { mainWorldToBackground } from '~util/mainWorldToBackground';
import { waitForElement } from '~util/waitForElement';

import type { IObserverEmitter } from './IObserverEmitter';

export class SpotifyObserverEmitter implements IObserverEmitter {
  private _controller: SpotifyController;
  private _mutationObservers: MutationObserver[] = [];
  private _paused = true;

  constructor(controller: SpotifyController) {
    this._controller = controller;
  }

  public async observe(): Promise<void> {
    await waitForElement('.player-controls');

    this._setupPlayerStateObserver();
    await this._setupSongInfoObserver();
  }

  public pause(): void {
    this._paused = true;
  }

  public resume(): void {
    this._paused = false;
  }

  public unobserve(): void {
    this._mutationObservers.forEach((observer) => observer.disconnect());
  }

  private _setupPlayerStateObserver() {
    const playerStateObserver = new MutationObserver(async () => {
      await this._sendPlaybackUpdatedMessage();
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

  private async _setupSongInfoObserver() {
    const nowPlayingWidgetSelector = 'div[data-testid="now-playing-widget"]';

    const songInfoObserver = new MutationObserver(async () => {
      const nowPlayingWidget = document.querySelector(nowPlayingWidgetSelector);
      await this._sendSongInfoUpdatedMessage(
        nowPlayingWidget?.getAttribute('aria-label') ?? ''
      );
    });

    const nowPlayingWidget = await waitForElement(nowPlayingWidgetSelector);
    if (nowPlayingWidget) {
      songInfoObserver.observe(nowPlayingWidget, {
        attributeFilter: ['aria-label']
      });
    }

    this._mutationObservers.push(songInfoObserver);
  }

  /**
   * The Spotify API can take more time than the mutation observer to update the current
   * song info. This method will retry up to 5 times to get the current song info that
   * matches the UI's song info.
   */
  private async _sendSongInfoUpdatedMessage(
    nowPlayingText: string
  ): Promise<void> {
    if (this._paused) {
      return;
    }

    for (let i = 0; i < 5; i++) {
      const songInfo = await this._controller.getCurrentSongInfo();

      if (!nowPlayingText.includes(songInfo.trackName)) {
        await wait(1000);
        continue;
      }

      await mainWorldToBackground({
        name: EventMessageType.SONG_INFO_UPDATED,
        body: {
          songInfo
        }
      });
    }
  }

  private async _sendPlaybackUpdatedMessage(): Promise<void> {
    if (this._paused) {
      return;
    }

    await mainWorldToBackground({
      name: EventMessageType.PLAYBACK_UPDATED,
      body: {
        playbackState: await this._controller.getPlayerState()
      }
    });
  }
}
