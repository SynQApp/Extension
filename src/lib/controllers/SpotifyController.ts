import { SpotifyEndpoints } from '~constants/spotify';
import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import { RepeatMode } from '~types/RepeatMode';

import type { IController } from './IController';

const REPEAT_MAP: Record<string, RepeatMode> = {
  track: RepeatMode.REPEAT_ONE,
  context: RepeatMode.REPEAT_ALL,
  off: RepeatMode.NO_REPEAT
};

export class SpotifyController implements IController {
  private _accessToken: string;
  private _playerReady = false;

  constructor() {
    const sessionElement = document.getElementById('session');
    const session = JSON.parse(sessionElement.innerText);

    this._accessToken = session.accessToken;
  }

  public async play(): Promise<void> {
    await this._fetchSpotify(SpotifyEndpoints.PLAY, 'PUT');
  }

  public async playPause(): Promise<void> {
    const playerState = await this.getPlayerState();

    if (playerState.isPlaying) {
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
    await this._fetchSpotify(SpotifyEndpoints.PREVIOUS, 'POST');
  }

  public async toggleRepeatMode(): Promise<void> {
    const playerState = await this._fetchSpotify(
      SpotifyEndpoints.PLAYER_STATE,
      'GET'
    );

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
    const currentlyPlaying = await this._fetchSpotify(
      SpotifyEndpoints.CURRENTLY_PLAYING,
      'GET'
    );

    const ids = [currentlyPlaying.item.id];

    const searchParams = new URLSearchParams({
      ids: ids.join(',')
    });

    // Returns array of booleans, get the first one
    const [inLibrary] = await this._fetchSpotify(
      `${SpotifyEndpoints.IS_IN_LIBRARY}?${searchParams.toString()}`,
      'GET'
    );

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

  public async setVolume(volume: number): Promise<void> {
    const searchParams = new URLSearchParams({
      volume_percent: volume.toString()
    });

    await this._fetchSpotify(
      `${SpotifyEndpoints.SET_VOLUME}?${searchParams.toString()}`,
      'PUT'
    );
  }

  public async seekTo(time: number): Promise<void> {
    const searchParams = new URLSearchParams({
      position_ms: (time * 1000).toString()
    });

    await this._fetchSpotify(
      `${SpotifyEndpoints.SEEK_TO}?${searchParams.toString()}`,
      'PUT'
    );
  }

  /**
   * EXAMPLE IDs:
   * - 2Ou1Hyvr08mr0pZauPvv6j
   * - 1Bh8jtOXIBIRUUghbrwUTX
   */
  public async startTrack(trackId: string): Promise<void> {
    await this._fetchSpotify(SpotifyEndpoints.PLAY, 'PUT', {
      uris: [`spotify:track:${trackId}`],
      position_ms: 0
    });
  }

  public async prepareForSession(): Promise<void> {
    if (!this._playerReady) {
      await this._forceInitializePlayer();
    }
  }

  public async getPlayerState(): Promise<PlayerState> {
    const playerState = await this._fetchSpotify(
      SpotifyEndpoints.PLAYER_STATE,
      'GET'
    );

    const searchParams = new URLSearchParams({
      ids: playerState.item.id
    });

    const [inLibrary] = await this._fetchSpotify(
      `${SpotifyEndpoints.IS_IN_LIBRARY}?${searchParams.toString()}`,
      'GET'
    );

    const songInfo: SongInfo = this._itemToSongInfo(playerState.item);
    songInfo.isLiked = inLibrary;

    return {
      currentTime: playerState?.progress_ms
        ? playerState.progress_ms / 1000
        : 0,
      isPlaying: playerState?.is_playing ?? false,
      repeatMode: playerState?.repeat_state
        ? REPEAT_MAP[playerState.repeat_state]
        : RepeatMode.NO_REPEAT,
      volume: playerState?.device?.volume_percent ?? 0,
      songInfo
    };
  }

  public async getQueue(): Promise<SongInfo[]> {
    const queueRes = await this._fetchSpotify(
      SpotifyEndpoints.GET_QUEUE,
      'GET'
    );

    const queue = queueRes.queue;

    return queue.map((item) => this._itemToSongInfo(item));
  }

  public async isReady(): Promise<true | NotReadyReason> {
    const configElement = document.getElementById('config');
    const config = JSON.parse(configElement.innerText);

    if (!config.isPremium) {
      return NotReadyReason.NON_PREMIUM_USER;
    }

    if (!this._playerReady) {
      return NotReadyReason.NOT_CONTROLLABLE;
    }

    return true;
  }

  private _itemToSongInfo(item: any): SongInfo {
    return {
      trackId: item.id,
      trackName: item.name,
      albumName: item.album.name,
      artistName: item.artists.map((artist) => artist.name).join(' & '),
      albumCoverUrl: item.album.images[0].url,
      duration: item.duration_ms / 1000
    };
  }

  /**
   * Fetch from Spotify API.
   */
  private async _fetchSpotify(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) {
    await this._preparePlayer();

    return this._rawFetchSpotify(url, method, body);
  }

  private async _rawFetchSpotify(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
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

      console.log(res);

      return res.json();
    });
  }

  /**
   * _playerReady could be false if either the player is actually not ready,
   * or if we haven't checked yet. First check if API can be used, and if not,
   * initialize the player.
   */
  private async _preparePlayer() {
    if (!this._playerReady) {
      const remotePlayer = await this._rawFetchSpotify(
        SpotifyEndpoints.PLAYER_STATE,
        'GET'
      );

      if (remotePlayer) {
        this._playerReady = true;
      } else {
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
      const playButton = document.querySelector(
        'button[data-testid="control-button-playpause"]'
      ) as HTMLButtonElement;

      playButton.click();

      const observer = new MutationObserver((mutations, observerInstance) => {
        if (playButton.attributes['aria-label'].value === 'Pause') {
          playButton.click();
          observerInstance.disconnect();
          this._playerReady = true;
          resolve(void 0);
        }
      });

      observer.observe(playButton, {
        attributes: true,
        attributeFilter: ['aria-label']
      });
    });
  }
}
