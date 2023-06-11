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
    this._player.play();
  }

  public playPause(): void {
    if (this._player.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause(): void {
    this._player.pause();
  }

  public next(): void {
    this._player.skipToNextItem();
  }

  public previous(): void {
    this._player.skipToPreviousItem();
  }

  public setRepeatMode(repeatMode: RepeatMode): void {
    this._player.repeatMode = REPEAT_MAP[repeatMode];
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
    this._player.volume = volume / 100;
  }

  public seekTo(time: number): void {
    this._player.seekToTime(time);
  }

  /**
   * EXAMPLE IDs:
   * - 388136191
   * - 560097694
   */
  public async startTrack(trackId: string): Promise<void> {
    await this._player.playLater({ song: trackId }); // Loads the song in the player
    await this._player.changeToMediaItem(trackId);
  }

  public prepareForSession(): Promise<void> {
    return;
  }

  // TODO: Implement
  public getPlayerState(): PlayerState {
    // Get repeatMode from player and convert to RepeatMode
    const repeatMode = Object.keys(REPEAT_MAP).find(
      (key) => REPEAT_MAP[key] === this._player.repeatMode
    ) as RepeatMode;

    const track = this._player.nowPlayingItem?.attributes;

    if (!track) {
      return this._emptyPlayerState;
    }

    const songInfo: SongInfo = {
      albumCoverUrl: track.artwork.url.replace('{w}x{h}bb', '100x100'),
      albumName: track.albumName,
      artistName: track.artistName,
      trackName: track.name,
      trackId: track.playParams.id,
      isLiked: undefined,
      isDisliked: undefined
    };

    const playerState: PlayerState = {
      currentTime: this._player.currentPlaybackTime,
      duration: this._player.currentPlaybackDuration,
      isPlaying: this._player.isPlaying,
      repeatMode: repeatMode,
      volume: this._player.volume * 100,
      songInfo: songInfo
    };

    return playerState;
  }

  // TODO: Implement
  public getQueue(): Promise<SongInfo[]> {
    throw new Error('Method not implemented.');
  }

  // TODO: Implement
  public isReady(): boolean {
    throw new Error('Method not implemented.');
  }

  private get _player() {
    return (window as any).MusicKit.getInstance();
  }

  private get _emptyPlayerState(): PlayerState {
    return {
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      repeatMode: RepeatMode.NO_REPEAT,
      volume: 0,
      songInfo: {
        albumCoverUrl: '',
        albumName: '',
        artistName: '',
        trackName: '',
        trackId: '',
        isLiked: undefined,
        isDisliked: undefined
      }
    };
  }
}
