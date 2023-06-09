import type { RepeatMode } from '~types/RepeatMode';

import type { IController } from './IController';

export class SpotifyController implements IController {
  play(): void {
    throw new Error('Method not implemented.');
  }

  playPause(): void {
    throw new Error('Method not implemented.');
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }

  next(): void {
    throw new Error('Method not implemented.');
  }

  previous(): void {
    throw new Error('Method not implemented.');
  }

  setRepeatMode(repeatMode: RepeatMode): void {
    throw new Error('Method not implemented.');
  }

  toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  setVolume(volume: number): void {
    throw new Error('Method not implemented.');
  }

  seekTo(time: number): void {
    throw new Error('Method not implemented.');
  }

  startTrack(trackId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  prepareForSession(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
