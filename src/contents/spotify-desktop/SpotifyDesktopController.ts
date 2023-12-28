import type { Track as NativeTrack, SpotifyApi } from '@spotify/web-api-ts-sdk';

import type { MusicController } from '~contents/lib/MusicController';
import {
  type NotReadyReason,
  type PlayerState,
  type QueueItem,
  RepeatMode,
  type Track,
  type ValueOrPromise
} from '~types';
import { findIndexes } from '~util/findIndexes';

const REPEAT_MAP: Record<string, RepeatMode> = {
  0: RepeatMode.NO_REPEAT,
  1: RepeatMode.REPEAT_ALL,
  2: RepeatMode.REPEAT_ONE
};

export class SpotifyDesktopController implements MusicController {
  private _player: Spotify.Player;
  private _spotifyApi: SpotifyApi;
  private _muteVolume: number | null = null;

  private _cachedPlayerState: {
    playerState: PlayerState;
    timestamp: number;
  } | null = null;

  constructor(player: Spotify.Player, spotifyApi: SpotifyApi) {
    this._player = player;
    this._spotifyApi = spotifyApi;
  }

  play(): ValueOrPromise<void> {
    return this._player.resume();
  }

  playPause(): ValueOrPromise<void> {
    return this._player.togglePlay();
  }

  pause(): ValueOrPromise<void> {
    return this._player.pause();
  }

  next(): ValueOrPromise<void> {
    return this._player.nextTrack();
  }

  async previous(): Promise<void> {
    const playerState = await this._player.getCurrentState();

    if (playerState?.position && playerState.position > 3000) {
      return this._player.seek(0);
    }

    return this._player.previousTrack();
  }

  async toggleRepeatMode(): Promise<void> {
    const currentState = await this.getPlayerState(true);
    let newRepeatMode = currentState?.repeatMode || RepeatMode.NO_REPEAT;

    switch (newRepeatMode) {
      case RepeatMode.NO_REPEAT:
        await this._spotifyApi.player.setRepeatMode('context');
        newRepeatMode = RepeatMode.REPEAT_ONE;
        break;

      case RepeatMode.REPEAT_ALL:
        await this._spotifyApi.player.setRepeatMode('track');
        newRepeatMode = RepeatMode.NO_REPEAT;
        break;

      case RepeatMode.REPEAT_ONE:
        await this._spotifyApi.player.setRepeatMode('off');
        newRepeatMode = RepeatMode.REPEAT_ALL;
        break;
    }

    if (this._cachedPlayerState) {
      this._cachedPlayerState.playerState = {
        ...this._cachedPlayerState.playerState,
        repeatMode: newRepeatMode
      };
    }
  }

  async toggleLike(): Promise<void> {
    const currentTrack = await this.getCurrentTrack();

    if (!currentTrack) {
      return;
    }

    const [isSaved] = await this._spotifyApi.currentUser.tracks.hasSavedTracks([
      currentTrack.id
    ]);

    if (isSaved) {
      await this._spotifyApi.currentUser.tracks.removeSavedTracks([
        currentTrack.id
      ]);
    } else {
      await this._spotifyApi.currentUser.tracks.saveTracks([currentTrack.id]);
    }
  }

  toggleDislike(): ValueOrPromise<void> {
    throw new Error('Method not implemented.');
  }

  async toggleMute(): Promise<void> {
    const currentVolume = await this._player.getVolume();

    if (!currentVolume) {
      await this.setVolume(this._muteVolume || 50);
    } else {
      this._muteVolume = currentVolume * 100;
      await this.setVolume(0);
    }
  }

  async setVolume(
    volume: number,
    relative?: boolean | undefined
  ): Promise<void> {
    let newVolume = volume;

    if (relative) {
      const currentVolume = await this._player.getVolume();

      if (currentVolume) {
        newVolume = currentVolume + volume * 100;
      }
    }

    await this._player.setVolume(newVolume / 100);

    if (this._cachedPlayerState) {
      this._cachedPlayerState.playerState = {
        ...this._cachedPlayerState.playerState,
        volume: newVolume
      };
    }
  }

  seekTo(time: number): ValueOrPromise<void> {
    this._player.seek(time * 1000);
  }

  prepareForAutoplay(): ValueOrPromise<void> {
    return;
  }

  async getPlayerState(
    noCache?: boolean,
    nativePlayerState?: Spotify.PlaybackState | null
  ): Promise<PlayerState | null> {
    if (this._cachedPlayerState && !noCache) {
      let { playerState, timestamp } = this._cachedPlayerState;
      const currentTimestamp = new Date().getTime();
      const delta = currentTimestamp - timestamp;

      if (playerState.isPlaying) {
        playerState = {
          ...playerState,
          currentTime: Math.round(playerState.currentTime + delta / 1000)
        };
      }

      this._cachedPlayerState = {
        playerState,
        timestamp: currentTimestamp
      };

      return playerState;
    }

    if (!nativePlayerState) {
      nativePlayerState = await this._player.getCurrentState();
    }

    const volume = await this._player.getVolume();

    if (!nativePlayerState) {
      return null;
    }

    const playerState: PlayerState = {
      currentTime: Math.round(nativePlayerState.position / 1000),
      isPlaying: !nativePlayerState.paused,
      repeatMode: REPEAT_MAP[nativePlayerState.repeat_mode],
      volume: Math.round(volume * 100),
      queue: await this.getQueue()
    };

    this._cachedPlayerState = {
      playerState,
      timestamp: new Date().getTime()
    };

    return playerState;
  }

  async getCurrentTrack(): Promise<Track | null> {
    const currentState = await this._player.getCurrentState();
    const nativeTrack = currentState?.track_window.current_track;

    if (!nativeTrack) {
      return null;
    }

    const track = this._itemToSongInfo(nativeTrack);

    return track;
  }

  async getQueue(): Promise<QueueItem[]> {
    const queueRes = await this._spotifyApi.player.getUsersQueue();
    const queue = queueRes.queue as NativeTrack[];

    const tracks = queue.map(this._itemToSongInfo);
    const currentTrack = await this.getCurrentTrack();

    tracks.unshift(currentTrack!);

    const queueItems = tracks.map((track, index) => ({
      isPlaying: index === 0,
      track
    }));

    return queueItems;
  }

  isReady(): ValueOrPromise<true | NotReadyReason> {
    return true;
  }

  async playQueueTrack(
    id: string,
    duplicateIndex: number | undefined = 0
  ): Promise<void> {
    // Get current queue track ids
    // Find index of id
    // Use startPlayback endpoint with list of ids and index
    const queue = await this.getQueue();
    const trackIds = queue.map((item) => item.track?.id || '');

    const trackIndexes = findIndexes(trackIds, (trackId) => trackId === id);
    const trackIndex = trackIndexes[duplicateIndex];

    const deviceId = this._player._options.id;
    const trackUris = trackIds.map((trackId) => `spotify:track:${trackId}`);

    await this._spotifyApi.player.startResumePlayback(
      deviceId,
      undefined,
      trackUris,
      {
        position: trackIndex
      }
    );

    return;
  }

  public clearPlayerStateCache(): void {
    this._cachedPlayerState = null;
  }

  private _itemToSongInfo(item: NativeTrack | Spotify.Track): Track {
    return {
      id: item.id!,
      name: item.name,
      albumName: item.album.name,
      artistName: item.artists.map((artist) => artist.name).join(' & '),
      albumCoverUrl: item.album.images[0].url,
      duration: Math.round(item.duration_ms / 1000)
    };
  }
}
