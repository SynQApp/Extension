import { getLink } from '@synq/music-service-clients';

import { SpotifyEndpoints } from '~adapters/spotify/constants';
import type { ContentController } from '~core/adapter';
import type { LinkTrack } from '~core/adapter';
import { RepeatMode } from '~types';
import type { PlaybackState, QueueItem, Track } from '~types';
import { debounce } from '~util/debounce';
import { findIndexes } from '~util/findIndexes';
import { normalizeVolume } from '~util/volume';

import { getAuthorizationToken } from './auth';
import type { NativeSpotifySongTrack, NativeSpotifyTrack } from './types';

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

const QUEUE_CACHE_TIME = 30000;

export class SpotifyContentController implements ContentController {
  private _accessToken: string;
  private _cachedQueue:
    | {
        items: QueueItem[] | undefined;
        trackId: string | undefined;
      }
    | undefined = undefined;
  private _queueLoading: boolean = false;
  private _currentTrack: Track | null = null;
  private _currentTrackLoading: boolean = false;

  constructor() {
    const sessionElement = document.getElementById('session');
    if (!sessionElement) {
      throw new Error('Session element not found');
    }
    const session = JSON.parse(sessionElement.innerText);

    this._accessToken = session.accessToken;
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

  public async getPlayerState(): Promise<PlaybackState | null> {
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
      queue: await this.getQueue()
    };
  }

  public async getCurrentTrack(partial?: boolean): Promise<Track | null> {
    const name = (
      document.querySelector(
        'div[data-testid="context-item-info-title"]'
      ) as HTMLElement
    )?.innerText;

    let artistNameElements = Array.from(
      document.querySelectorAll('a[data-testid="context-item-info-artist"]')
    ) as HTMLElement[];

    if (!artistNameElements.length) {
      artistNameElements = Array.from(
        document.querySelectorAll('a[data-testid="context-item-info-show"]')
      ) as HTMLElement[];
    }

    const artistName = artistNameElements
      ?.map((element: HTMLElement) => element.innerText)
      .join(', ');

    const albumCoverUrl = (
      document.querySelector(
        'img[data-testid="cover-art-image"]'
      ) as HTMLImageElement
    )?.src;

    const playbackProgressBarElement = document.querySelector(
      'div[data-testid="playback-progressbar"]'
    );
    const playbackProgressBarInput = playbackProgressBarElement?.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;

    const duration = playbackProgressBarInput
      ? parseInt(playbackProgressBarInput.getAttribute('max') ?? '0')
      : 0;

    let currentTrack: Track | null = {
      id: '',
      name: name ?? '',
      artistName: artistName ?? '',
      albumName: '',
      albumCoverUrl: albumCoverUrl ?? '',
      duration
    };

    if (partial) {
      return currentTrack;
    }

    if (
      !this._currentTrackLoading &&
      (!this._currentTrack ||
        !this._compareTracks(currentTrack, this._currentTrack))
    ) {
      this._currentTrackLoading = true;

      const query = new URLSearchParams({
        additional_types: 'track,episode'
      });

      const trackResponse = await this._fetchSpotify<{
        item: NativeSpotifyTrack;
      }>(`${SpotifyEndpoints.CURRENTLY_PLAYING}?${query.toString()}`, 'GET');

      this._currentTrackLoading = false;

      if (!trackResponse?.item) {
        return null;
      }

      if (trackResponse.item.type === 'episode') {
        currentTrack.type = 'podcast';
      } else {
        currentTrack.type = 'song';
      }

      const id = trackResponse.item.id;
      const link = getLink({
        musicService: 'SPOTIFY',
        trackId: id,
        type: 'TRACK'
      });

      currentTrack.id = trackResponse.item.id;
      currentTrack.link = link;

      const isInLibraryParams = new URLSearchParams({
        ids: currentTrack.id
      });

      const isLiked = await this._fetchSpotify<boolean[]>(
        `${SpotifyEndpoints.IS_IN_LIBRARY}?${isInLibraryParams.toString()}`,
        'GET'
      );

      currentTrack.isLiked = isLiked?.[0];
    } else {
      currentTrack = this._currentTrack;
    }

    this._currentTrack = currentTrack;

    return currentTrack;
  }

  public async getQueue(noCache?: boolean): Promise<QueueItem[]> {
    // If the queue is cached and the current track is the same, the queue is
    // likely the same as well (unless someone added or removed a track). Return
    // the cached queue.
    if (
      !noCache &&
      !this._queueLoading &&
      this._cachedQueue?.trackId &&
      this._cachedQueue.trackId === this._currentTrack?.id
    ) {
      return this._cachedQueue.items ?? [];
    }

    this._queueLoading = true;

    const queueRes = await this._fetchSpotify<{ queue: NativeSpotifyTrack[] }>(
      SpotifyEndpoints.GET_QUEUE,
      'GET'
    );

    this._queueLoading = false;

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

    this._cacheQueue(queueItems, this._currentTrack?.id);

    return queueItems;
  }

  public async playQueueTrack(id: string, duplicateIndex = 0): Promise<void> {
    const queue = await this.getQueue(true);
    const trackIds = queue.map((item) => item.track?.id);

    const trackIndexes = findIndexes(trackIds, (trackId) => trackId === id);

    const trackIndex = trackIndexes[duplicateIndex];

    await this._fetchSpotify(SpotifyEndpoints.PLAY, 'PUT', {
      uris: queue.map(
        (item) =>
          `spotify:${item.track?.type === 'podcast' ? 'episode' : 'track'}:${
            item.track?.id
          }`
      ),
      offset: {
        position: trackIndex
      }
    });

    this._cachedQueue = undefined;

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

  async getLinkTrack(): Promise<LinkTrack> {
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    const trackId = pathParts[pathParts.length - 1];

    const track = await this._getTrack(trackId);

    if (!track) {
      return null;
    }

    return {
      name: track.name,
      artistName: track.artists[0].name,
      albumName: track.album.name,
      duration: track.duration_ms,
      albumCoverUrl: track.album.images[0].url
    };
  }

  private async _getTrack(id: string): Promise<NativeSpotifySongTrack | null> {
    const token = await getAuthorizationToken();

    const response = await fetch(`${SpotifyEndpoints.TRACKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => response.json());

    return response;
  }

  private _itemToSongInfo(item: NativeSpotifyTrack): Track {
    if (item.type === 'episode') {
      return {
        id: item.id,
        name: item.name,
        albumName: item.show.name,
        artistName: item.show.publisher,
        albumCoverUrl: item.images[0].url,
        duration: Math.round(item.duration_ms / 1000),
        type: 'podcast'
      };
    }

    const link = getLink({
      musicService: 'SPOTIFY',
      trackId: item.id,
      type: 'TRACK'
    });

    return {
      albumCoverUrl: item.album?.images[0].url,
      albumName: item.album?.name,
      artistName: item.artists.map((artist) => artist.name).join(' & '),
      duration: Math.round(item.duration_ms / 1000),
      id: item.id,
      link,
      name: item.name,
      type: 'song'
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

  /**
   * If the player hasn't been interacted with, API calls will fail. This method
   * clicks the play button to initialize the player and then again once it has
   * started playing to pause it.
   */
  // private async _forceInitializePlayer() {
  //   return new Promise((resolve) => {
  //     const isMuted = this._getVolume() === 0;

  //     if (!isMuted) {
  //       this.toggleMute();
  //     }

  //     const playButton = document.querySelector(
  //       'button[data-testid="control-button-playpause"]'
  //     ) as HTMLButtonElement;

  //     playButton.click();

  //     const observer = new MutationObserver((mutations, observerInstance) => {
  //       const playButtonValue = playButton.getAttribute('aria-label');
  //       if (playButtonValue === 'Pause') {
  //         playButton.click();
  //         observerInstance.disconnect();

  //         if (!isMuted) {
  //           this.toggleMute();
  //         }

  //         resolve(void 0);
  //       }
  //     });

  //     observer.observe(playButton, {
  //       attributes: true,
  //       attributeFilter: ['aria-label']
  //     });
  //   });
  // }

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
    }, QUEUE_CACHE_TIME);
  }

  private _compareTracks(track1: Track, track2: Track): boolean {
    return (
      track1.name === track2.name &&
      track1.artistName === track2.artistName &&
      track1.duration === track2.duration &&
      track1.albumCoverUrl === track2.albumCoverUrl
    );
  }
}
