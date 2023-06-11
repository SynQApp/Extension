import { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';

import type { IController } from './IController';

// TODO: Implement the Controller
export class SpotifyController implements IController {
  public play(): void {
    throw new Error('Method not implemented.');
  }

  public playPause(): void {
    throw new Error('Method not implemented.');
  }

  public pause(): void {
    throw new Error('Method not implemented.');
  }

  public next(): void {
    throw new Error('Method not implemented.');
  }

  public previous(): void {
    throw new Error('Method not implemented.');
  }

  public toggleRepeatMode(): void {
    throw new Error('Method not implemented.');
  }

  public toggleLike(): void {
    throw new Error('Method not implemented.');
  }

  public toggleDislike(): void {
    throw new Error('Method not implemented.');
  }

  public setVolume(volume: number): void {
    throw new Error('Method not implemented.');
  }

  public seekTo(time: number): void {
    throw new Error('Method not implemented.');
  }

  public startTrack(trackId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public prepareForSession(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getPlayerState(): Promise<PlayerState> {
    throw new Error('Method not implemented.');
  }

  public getQueue(): Promise<SongInfo[]> {
    throw new Error('Method not implemented.');
  }

  public isReady(): true | NotReadyReason {
    throw new Error('Method not implemented.');
  }
}
