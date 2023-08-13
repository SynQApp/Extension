import { SEARCH_LIMIT } from '~constants/search';
import { NotReadyReason, RepeatMode } from '~types';
import type {
  PlayerState,
  QueueItem,
  Track,
  TrackSearchResult,
  ValueOrPromise
} from '~types';
import { findIndexes } from '~util/findIndexes';

import type { MusicController } from './MusicController';

declare let window: Window & {
  MusicKit: any;
};

const REPEAT_MAP: Record<RepeatMode, number> = {
  [RepeatMode.NO_REPEAT]: 0,
  [RepeatMode.REPEAT_ONE]: 1,
  [RepeatMode.REPEAT_ALL]: 2
};

/**
 * In general, the strategy for controlling Apple Music is to use the MusicKit instance
 * already exposed on the window object. Then we can call methods on the instance to
 * control playback.
 */
export class AppleMusicController implements MusicController {
  private _unmuteVolume = 50;

  public play(): void {
    this.getPlayer().play();
  }

  public playPause(): void {
    if (this.getPlayer().isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause(): void {
    this.getPlayer().pause();
  }

  public next(): void {
    this.getPlayer().skipToNextItem();
  }

  public previous(): void {
    this.getPlayer().skipToPreviousItem();
  }

  public toggleRepeatMode(): void {
    switch (this.getPlayer().repeatMode) {
      case 0:
        this.getPlayer().repeatMode = 1;
        break;
      case 1:
        this.getPlayer().repeatMode = 2;
        break;
      case 2:
        this.getPlayer().repeatMode = 0;
        break;
    }
  }

  /**
   * No-op. Apple Music web player doesn't support likes/dislikes.
   */
  public toggleLike(): void {
    return;
  }

  /**
   * No-op. Apple Music web player doesn't support likes/dislikes.
   */
  public toggleDislike(): void {
    return;
  }

  public toggleMute(): void {
    const volume = this.getPlayer().volume * 100;

    if (volume === 0) {
      this.setVolume(this._unmuteVolume);
    } else {
      this._unmuteVolume = volume;
      this.setVolume(0);
    }
  }

  public setVolume(volume: number): void {
    this.getPlayer().volume = volume / 100;
  }

  public seekTo(time: number): void {
    this.getPlayer().seekToTime(time);
  }

  /**
   * EXAMPLE IDs:
   * - 388136191
   * - 560097694
   */
  public async startTrack(trackId: string): Promise<void> {
    // Loads the song in the player which is required to change to it.
    await this.getPlayer().playLater({ song: trackId });
    await this.getPlayer().changeToMediaItem(trackId);
  }

  public prepareForAutoplay(): void {
    return;
  }

  public prepareForSession(): void {
    return;
  }

  public getPlayerState(): PlayerState | undefined {
    if (!this.getPlayer()) {
      return undefined;
    }

    const nowPlayingItem = this.getPlayer().nowPlayingItem;

    if (!nowPlayingItem) {
      return undefined;
    }

    const repeatMode = Object.keys(REPEAT_MAP).find(
      (key) => REPEAT_MAP[key] === this.getPlayer().repeatMode
    ) as RepeatMode;

    const playerState: PlayerState = {
      currentTime: this.getPlayer().currentPlaybackTime,
      isPlaying: this.getPlayer().isPlaying,
      repeatMode: repeatMode,
      volume: this.getPlayer().volume * 100,
      queue: this.getQueue()
    };

    return playerState;
  }

  public getCurrentTrack(): Track {
    const nowPlayingItem = this.getPlayer().nowPlayingItem;

    if (!nowPlayingItem) {
      return null;
    }

    return this._mediaItemToSongInfo(nowPlayingItem);
  }

  public getQueue(): QueueItem[] {
    const appleMusicQueueItems = this.getPlayer().queue._queueItems as any[];
    const nowPlayingIndex = this.getPlayer().nowPlayingItemIndex;

    return appleMusicQueueItems.map((item, index) => {
      const queueItem: QueueItem = {
        songInfo: this._mediaItemToSongInfo(item.item),
        isPlaying: index === nowPlayingIndex
      };

      return queueItem;
    });
  }

  public isReady(): true | NotReadyReason {
    if (!this._isPremiumUser()) {
      return NotReadyReason.NON_PREMIUM_USER;
    }

    return true;
  }

  public playQueueTrack(id: string, duplicateIndex = 0): ValueOrPromise<void> {
    const queue = this.getQueue();

    const trackIndexes = findIndexes(queue, (item) => item.songInfo.id === id);
    const trackIndex = trackIndexes[duplicateIndex];

    this.getPlayer().changeToMediaAtIndex(trackIndex);
  }

  public async searchTracks(query: string): Promise<TrackSearchResult[]> {
    const player = this.getPlayer();

    const results = await player.api.search(query, {
      limit: SEARCH_LIMIT,
      types: 'songs'
    });

    const tracks = results?.songs?.data?.map((song: any) => {
      return this._mediaItemToSongInfo(song);
    });

    return tracks ?? [];
  }

  private async _isPremiumUser(): Promise<boolean> {
    const me = await this.getPlayer().me();
    return me.subscription.active;
  }

  private _mediaItemToSongInfo(mediaItem: any): Track {
    const track = mediaItem.attributes;

    return {
      albumCoverUrl: track.artwork.url.replace('{w}x{h}bb', '100x100'),
      albumName: track.albumName,
      artistName: track.artistName,
      name: track.name,
      id: track.playParams.id,
      duration: Math.round(track.durationInMillis / 1000)
    };
  }

  public getPlayer() {
    return (window as any).MusicKit.getInstance();
  }
}
