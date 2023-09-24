import { SEARCH_LIMIT, SEARCH_OFFSET } from '~constants/search';
import { SpotifyEndpoints } from '~constants/spotify';
import { NotReadyReason, RepeatMode } from '~types';
import type { PlayerState, QueueItem, Track } from '~types';
import type { NativeSpotifyTrack } from '~types/Spotify';
import { debounce } from '~util/debounce';
import { findIndexes } from '~util/findIndexes';
import { normalizeVolume } from '~util/volume';
import { waitForElement } from '~util/waitForElement';

import type { MusicController } from './MusicController';

const REPEAT_MAP: Record<string, RepeatMode> = {
  track: RepeatMode.REPEAT_ONE,
  context: RepeatMode.REPEAT_ALL,
  off: RepeatMode.NO_REPEAT
};

const REPEAT_UI_MAP: Record<string, RepeatMode> = {
  'Enable repeat': RepeatMode.NO_REPEAT,
  'Enable repeat one': RepeatMode.REPEAT_ALL,
  'Disable repeat': RepeatMode.REPEAT_ONE
};

const QUEUE_PATH = '/queue';

export class SpotifyController implements MusicController {
  private _accessToken: string;
  private _cachedQueue:
    | {
        items: QueueItem[] | undefined;
        trackId: string | undefined;
      }
    | undefined = undefined;
  private _currentTrackId: string | undefined = undefined;
  private _market: string;

  constructor() {
    const sessionElement = document.getElementById('session');
    if (!sessionElement) {
      throw new Error('Session element not found');
    }
    const session = JSON.parse(sessionElement.innerText);

    this._accessToken = session.accessToken;

    const configElement = document.getElementById('config');
    if (!configElement) {
      throw new Error('Config element not found');
    }
    const config = JSON.parse(configElement.innerText);
    this._market = config.market;
  }

  public async play(): Promise<void> {
    await this._fetchSpotify(SpotifyEndpoints.PLAY, 'PUT');
  }

  public async playPause(): Promise<void> {
    const playerState = await this.getPlayerState();

    if (playerState?.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  public async pause(): Promise<void> {
    await this._fetchSpotify(SpotifyEndpoints.PAUSE, 'PUT');
  }

  public async next(): Promise<void> {
    await this._fetchSpotify(SpotifyEndpoints.NEXT, 'POST');
  }

  public async previous(): Promise<void> {
    const playerState = await this.getPlayerState();

    if (!playerState?.currentTime || playerState.currentTime < 5) {
      await this._fetchSpotify(SpotifyEndpoints.PREVIOUS, 'POST');
      return;
    }

    await this.seekTo(0);
  }

  public async toggleRepeatMode(): Promise<void> {
    const playerState = await this._fetchSpotify<{
      repeat_state: keyof typeof REPEAT_MAP;
    }>(SpotifyEndpoints.PLAYER_STATE, 'GET');

    if (!playerState) {
      return;
    }

    const repeatMode = REPEAT_MAP[playerState.repeat_state];

    switch (repeatMode) {
      case RepeatMode.NO_REPEAT:
        await this._fetchSpotify(
          `${SpotifyEndpoints.SET_REPEAT_MODE}?state=context`,
          'PUT'
        );
        break;
      case RepeatMode.REPEAT_ONE:
        await this._fetchSpotify(
          `${SpotifyEndpoints.SET_REPEAT_MODE}?state=off`,
          'PUT'
        );
        break;
      case RepeatMode.REPEAT_ALL:
        await this._fetchSpotify(
          `${SpotifyEndpoints.SET_REPEAT_MODE}?state=track`,
          'PUT'
        );
        break;
    }
  }

  public async toggleLike(): Promise<void> {
    const currentlyPlaying = await this._fetchSpotify<{
      item: NativeSpotifyTrack;
    }>(SpotifyEndpoints.CURRENTLY_PLAYING, 'GET');

    if (!currentlyPlaying?.item) {
      return;
    }

    const ids = [currentlyPlaying.item.id];

    const searchParams = new URLSearchParams({
      ids: ids.join(',')
    });

    // Returns array of booleans, get the first one
    const [inLibrary] =
      (await this._fetchSpotify<boolean[]>(
        `${SpotifyEndpoints.IS_IN_LIBRARY}?${searchParams.toString()}`,
        'GET'
      )) || [];

    if (inLibrary) {
      await this._fetchSpotify(SpotifyEndpoints.MODIFY_LIBRARY, 'DELETE', {
        ids
      });
    } else {
      await this._fetchSpotify(SpotifyEndpoints.MODIFY_LIBRARY, 'PUT', {
        ids
      });
    }
  }

  /**
   * Spotify doesn't have a dislike feature, so this is a no-op.
   */
  public async toggleDislike(): Promise<void> {
    return;
  }

  public toggleMute(): void {
    (
      document.querySelector(
        'button[aria-describedby="volume-icon"]'
      ) as HTMLButtonElement
    )?.click();
  }

  public async setVolume(volume: number, relative?: boolean): Promise<void> {
    if (relative) {
      volume = this._getVolume() + volume;
    }

    volume = normalizeVolume(volume);

    debounce(
      async () => {
        const searchParams = new URLSearchParams({
          volume_percent: volume.toString()
        });

        await this._fetchSpotify(
          `${SpotifyEndpoints.SET_VOLUME}?${searchParams.toString()}`,
          'PUT'
        );
      },
      'setVolume',
      25
    );
  }

  public async seekTo(time: number): Promise<void> {
    debounce(
      async () => {
        const searchParams = new URLSearchParams({
          position_ms: (time * 1000).toString()
        });

        await this._fetchSpotify(
          `${SpotifyEndpoints.SEEK_TO}?${searchParams.toString()}`,
          'PUT'
        );
      },
      'seekTo',
      25
    );
  }

  public async prepareForAutoplay(): Promise<void> {
    await this._preparePlayer();
  }

  public async getPlayerState(): Promise<PlayerState | null> {
    const playbackProgressBarElement = document.querySelector(
      'div[data-testid="playback-progressbar"]'
    );
    const playbackProgressBarInput = playbackProgressBarElement?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;

    if (!playbackProgressBarInput) {
      return null;
    }

    const currentTimeValue = playbackProgressBarInput.getAttribute('value');

    if (!currentTimeValue) {
      return null;
    }

    const currentTime = parseInt(currentTimeValue);

    const playPauseButton = document.querySelector(
      'button[data-testid="control-button-playpause"]'
    );
    // The aria-label is "Play" when the song is paused and "Pause" when the song is playing
    const isPlaying = playPauseButton?.getAttribute('aria-label') === 'Pause';

    const repeatButton = document.querySelector(
      'button[data-testid="control-button-repeat"]'
    );
    const repeatText = repeatButton?.getAttribute('aria-label');
    const repeatMode = repeatText
      ? REPEAT_UI_MAP[repeatText]
      : RepeatMode.NO_REPEAT;

    const volume = this._getVolume();

    return {
      currentTime,
      isPlaying,
      repeatMode,
      volume,
      // TODO: Decouple queue, removing it from PlayerState, as it doesn't make sense there and causes problems especially
      // for ObserverEmitter related tasks. Temp commented out so we can still test other functionality without overloading
      // Spotify API.
      // queue: await this.getQueue()
      queue: []
    };
  }

  public async getCurrentTrack(): Promise<Track | null> {
    const currentlyPlaying = await this._fetchSpotify<{
      item: NativeSpotifyTrack;
    }>(SpotifyEndpoints.CURRENTLY_PLAYING, 'GET');

    if (!currentlyPlaying?.item) {
      return null;
    }

    const currentSongInfo = this._itemToSongInfo(currentlyPlaying.item);

    const isInLibraryParams = new URLSearchParams({
      ids: currentlyPlaying.item.id
    });

    const isLiked = await this._fetchSpotify<boolean[]>(
      `${SpotifyEndpoints.IS_IN_LIBRARY}?${isInLibraryParams.toString()}`,
      'GET'
    );

    currentSongInfo.isLiked = isLiked?.[0];

    this._currentTrackId = currentlyPlaying.item.id;

    return currentSongInfo;
  }

  public async getQueue(noCache?: boolean): Promise<QueueItem[]> {
    // If the queue is cached and the current track is the same, the queue is
    // likely the same as well (unless someone added or removed a track). Return
    // the cached queue.
    if (
      !noCache &&
      this._cachedQueue?.trackId &&
      this._cachedQueue.trackId === this._currentTrackId
    ) {
      return this._cachedQueue.items ?? [];
    }

    const queueRes = await this._fetchSpotify<{ queue: NativeSpotifyTrack[] }>(
      SpotifyEndpoints.GET_QUEUE,
      'GET'
    );

    const queue = queueRes?.queue;
    const queueItems =
      queue?.map((item) => {
        const queueItem: QueueItem = {
          track: this._itemToSongInfo(item),
          isPlaying: false
        };

        return queueItem;
      }) || [];

    const currentSongInfo = await this.getCurrentTrack();
    const currentSongQueueItem: QueueItem = {
      track: currentSongInfo,
      isPlaying: true
    };

    queueItems.unshift(currentSongQueueItem);

    this._cacheQueue(queueItems, this._currentTrackId);

    return queueItems;
  }

  public async isReady(): Promise<true | NotReadyReason> {
    const playerReady = await this._isPlayerReady();

    if (!playerReady) {
      return NotReadyReason.AUTOPLAY_NOT_READY;
    }

    return true;
  }

  public async playQueueTrack(id: string, duplicateIndex = 0): Promise<void> {
    // If current track is the same as the one we want to play, just restart it
    if (this._currentTrackId === id && duplicateIndex === 0) {
      await this.seekTo(0);
      return;
    }

    const alreadyOnQueuePage = window.location.pathname === QUEUE_PATH;

    if (!alreadyOnQueuePage) {
      this._clickQueueButton();
    }

    const queue = await this.getQueue(true);
    const trackIndexes = findIndexes(queue, (item) => item.track?.id === id);
    const trackIndex = trackIndexes[duplicateIndex];

    const trackRows = await waitForElement(
      `div[data-testid="tracklist-row"]`,
      10000,
      true
    );

    const trackRow = trackRows[trackIndex] as HTMLDivElement;
    const trackButton = trackRow.querySelector('button');

    trackButton?.click();

    if (!alreadyOnQueuePage) {
      this._clickQueueButton();
    }

    return;
  }

  private _getVolume(): number {
    const volumeContainerElement = document.querySelector(
      'div[data-testid="volume-bar"]'
    );

    if (!volumeContainerElement) {
      return 50;
    }

    const volumeInputElement = volumeContainerElement.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    const volume = volumeInputElement
      ? parseFloat(volumeInputElement.value) * 100
      : 0;

    return volume;
  }

  private _clickQueueButton() {
    const queueButton = document.querySelector(
      'button[aria-label="Queue"]'
    ) as HTMLButtonElement;

    queueButton.click();
  }

  private _itemToSongInfo(item: NativeSpotifyTrack): Track {
    return {
      id: item.id,
      name: item.name,
      albumName: item.album.name,
      artistName: item.artists.map((artist) => artist.name).join(' & '),
      albumCoverUrl: item.album.images[0].url,
      duration: Math.round(item.duration_ms / 1000)
    };
  }

  /**
   * Fetch from Spotify API.
   */
  private async _fetchSpotify<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
  ) {
    return fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this._accessToken}`
      },
      body: body ? JSON.stringify(body) : undefined
    }).then((res) => {
      if (res.status === 204) {
        return;
      }

      return res.json() as Promise<T>;
    });
  }

  private async _isPlayerReady() {
    const playerState = await this._fetchSpotify(
      SpotifyEndpoints.PLAYER_STATE,
      'GET'
    );

    return !!playerState;
  }

  /**
   * _playerReady could be false if either the player is actually not ready,
   * or if we haven't checked yet. First check if API can be used, and if not,
   * initialize the player.
   */
  private async _preparePlayer() {
    const isPlayerReady = await this._isPlayerReady();

    if (!isPlayerReady) {
      const remotePlayer = await this._fetchSpotify(
        SpotifyEndpoints.PLAYER_STATE,
        'GET'
      );

      if (!remotePlayer) {
        await this._forceInitializePlayer();
      }
    }
  }

  /**
   * If the player hasn't been interacted with, API calls will fail. This method
   * clicks the play button to initialize the player and then again once it has
   * started playing to pause it.
   */
  private async _forceInitializePlayer() {
    return new Promise((resolve) => {
      const isMuted = this._getVolume() === 0;

      if (!isMuted) {
        this.toggleMute();
      }

      const playButton = document.querySelector(
        'button[data-testid="control-button-playpause"]'
      ) as HTMLButtonElement;

      playButton.click();

      const observer = new MutationObserver((mutations, observerInstance) => {
        const playButtonValue = playButton.getAttribute('aria-label');
        if (playButtonValue === 'Pause') {
          playButton.click();
          observerInstance.disconnect();

          if (!isMuted) {
            this.toggleMute();
          }

          resolve(void 0);
        }
      });

      observer.observe(playButton, {
        attributes: true,
        attributeFilter: ['aria-label']
      });
    });
  }

  /**
   * Cache the queue to prevent overwhelming the Spotify API.
   */
  private _cacheQueue(queue: QueueItem[], trackId?: string) {
    this._cachedQueue = {
      items: queue,
      trackId
    };

    setTimeout(() => {
      this._cachedQueue = undefined;
    }, 5000);
  }
}
