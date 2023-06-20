import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import { RepeatMode } from '~types/RepeatMode';

import type { IController } from './IController';

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
export class AppleMusicController implements IController {
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

  public prepareForSession(): Promise<void> {
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
      songInfo: this._mediaItemToSongInfo(this.getPlayer().nowPlayingItem)
    };

    return playerState;
  }

  public getQueue(): SongInfo[] {
    return this.getPlayer().queue._queueItems.map((queueItem: any) =>
      this._mediaItemToSongInfo(queueItem.item)
    );
  }

  public isReady(): true | NotReadyReason {
    if (!this._isPremiumUser()) {
      return NotReadyReason.NON_PREMIUM_USER;
    }

    return true;
  }

  private async _isPremiumUser(): Promise<boolean> {
    const me = await this.getPlayer().me();
    return me.subscription.active;
  }

  private _mediaItemToSongInfo(mediaItem: any): SongInfo {
    const track = mediaItem.attributes;

    return {
      albumCoverUrl: track.artwork.url.replace('{w}x{h}bb', '100x100'),
      albumName: track.albumName,
      artistName: track.artistName,
      trackName: track.name,
      trackId: track.playParams.id,
      duration: Math.round(track.durationInMillis / 1000)
    };
  }

  public getPlayer() {
    return (window as any).MusicKit.getInstance();
  }
}
