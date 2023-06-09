import { RepeatMode } from '~types/RepeatMode';
import type { SynQWindow } from '~types/Window';

import type { IController } from './IController';

// Allows us to access the MusicKit instance from the window object
// declare let window: SynQWindow;

const REPEAT_MAP: Record<RepeatMode, number> = {
  [RepeatMode.NO_REPEAT]: 0,
  [RepeatMode.REPEAT_ONE]: 1,
  [RepeatMode.REPEAT_ALL]: 2
};

export class AppleMusicController implements IController {
  private get _player() {
    return (window as any).MusicKit.getInstance();
  }

  play(): void {
    this._player.play();
  }

  playPause(): void {
    if (this._player.isPlaying) {
      this._player.pause();
    } else {
      this._player.play();
    }
  }

  pause(): void {
    this._player.pause();
  }

  next(): void {
    this._player.skipToNextItem();
  }

  previous(): void {
    this._player.skipToPreviousItem();
  }

  setRepeatMode(repeatMode: RepeatMode): void {
    this._player.repeatMode = REPEAT_MAP[repeatMode];
  }

  toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  setVolume(volume: number): void {
    this._player.volume = volume / 100;
  }

  seekTo(time: number): void {
    this._player.seekToTime(time);
  }

  async startTrack(trackId: string): Promise<void> {
    await this._player.playLater({ song: trackId }); // Loads the song in the player
    await this._player.changeToMediaItem(trackId);
  }

  prepareForSession(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
