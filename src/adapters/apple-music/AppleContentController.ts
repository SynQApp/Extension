import { getLink } from '@synq/music-service-clients';

import type {
  MusicKit,
  NativeAppleMusicMediaItem
} from '~adapters/apple-music/types';
import type { ContentController, LinkTrack } from '~core/adapter';
import { NotReadyReason, RepeatMode } from '~types';
import type { PlaybackState, QueueItem, Track, ValueOrPromise } from '~types';
import { findIndexes } from '~util/findIndexes';
import { normalizeVolume } from '~util/volume';

import type { MusicServicePlaybackController } from '../MusicServicePlaybackController';

declare let window: Window & {
  MusicKit: { getInstance: () => MusicKit };
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
export class AppleContentController implements ContentController {
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

  public setVolume(volume: number, relative?: boolean): void {
    if (relative) {
      volume = this.getPlayer().volume * 100 + volume;
    }

    volume = normalizeVolume(volume);

    this.getPlayer().volume = volume / 100;
  }

  public seekTo(time: number): void {
    this.getPlayer().seekToTime(time);
  }

  public prepareForAutoplay(): void {
    return;
  }

  public prepareForSession(): void {
    return;
  }

  public getPlayerState(): PlaybackState | null {
    if (!this.getPlayer()) {
      return null;
    }

    const nowPlayingItem = this.getPlayer().nowPlayingItem;

    if (!nowPlayingItem) {
      return null;
    }

    const repeatMode = Object.keys(REPEAT_MAP).find((key) => {
      const typedKey = key as keyof typeof REPEAT_MAP;
      REPEAT_MAP[typedKey] === this.getPlayer().repeatMode;
    }) as RepeatMode;

    const playerState: PlaybackState = {
      currentTime: this.getPlayer().currentPlaybackTime,
      isPlaying: this.getPlayer().isPlaying,
      repeatMode: repeatMode,
      volume: this.getPlayer().volume * 100,
      queue: this.getQueue()
    };

    return playerState;
  }

  public getCurrentTrack(): Track | null {
    if (!this.getPlayer()) {
      return null;
    }

    const nowPlayingItem = this.getPlayer().nowPlayingItem;

    if (!nowPlayingItem) {
      return null;
    }

    return this._mediaItemToSongInfo(nowPlayingItem);
  }

  public getQueue(): QueueItem[] {
    if (!this.getPlayer()) {
      return [];
    }

    const appleMusicQueueItems = this.getPlayer().queue._queueItems;
    const nowPlayingIndex = this.getPlayer().nowPlayingItemIndex;

    return appleMusicQueueItems.map((item, index) => {
      const queueItem: QueueItem = {
        track: this._mediaItemToSongInfo(item.item),
        isPlaying: index === nowPlayingIndex
      };

      return queueItem;
    });
  }

  public isReady(): true | NotReadyReason {
    return true;
  }

  public playQueueTrack(id: string, duplicateIndex = 0): ValueOrPromise<void> {
    const queue = this.getQueue();

    const trackIndexes = findIndexes(queue, (item) => {
      if (!item.track) {
        return false;
      }

      return item.track.id === id;
    });
    const trackIndex = trackIndexes[duplicateIndex];

    this.getPlayer().changeToMediaAtIndex(trackIndex);
  }

  public async getLinkTrack(): Promise<LinkTrack> {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('i');

    if (!trackId) {
      return null;
    }

    const track = await this._getTrack(trackId);

    if (!track) {
      return null;
    }

    return {
      name: track.attributes.name,
      artistName: track.attributes.artistName,
      albumName: track.attributes.albumName,
      duration: track.attributes.durationInMillis,
      albumCoverUrl: track.attributes.artwork.url
    };
  }

  private _mediaItemToSongInfo(mediaItem: NativeAppleMusicMediaItem): Track {
    const track = mediaItem.attributes;

    return {
      albumCoverUrl: track.artwork.url.replace('{w}x{h}bb', '100x100'),
      albumName: track.albumName,
      artistName: track.artistName,
      duration: Math.round(track.durationInMillis / 1000),
      id: track.playParams.id,
      link: getLink({
        musicService: 'APPLEMUSIC',
        trackId: track.playParams.id,
        type: 'TRACK'
      }),
      name: track.name
    };
  }

  private async _getTrack(
    id: string
  ): Promise<NativeAppleMusicMediaItem | null> {
    const musicKit = window.MusicKit.getInstance();
    const track = await musicKit.api.song(id);

    return track;
  }

  public getPlayer() {
    return window.MusicKit.getInstance();
  }
}
