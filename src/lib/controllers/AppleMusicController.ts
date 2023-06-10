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

  // TODO: Implement
  public toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  // TODO: Implement
  public toggleDislike(): void {
    throw new Error('Method not implemented.');
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
  public getPlayerState(): Promise<PlayerState> {
    throw new Error('Method not implemented.');
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
}
