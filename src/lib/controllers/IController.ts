import type { PlayerState, SongInfo } from '~types/PlayerState';
import type { RepeatMode } from '~types/RepeatMode';

export interface IController {
  /**
   * Play the current track.
   */
  play(): void;

  /**
   * Toggle play/pause.
   */
  playPause(): void;

  /**
   * Pause the current track.
   */
  pause(): void;

  /**
   * Skip to the next track.
   */
  next(): void;

  /**
   * Skip to the previous track.
   */
  previous(): void;

  /**
   * Set repeat mode.
   */
  setRepeatMode(repeatMode: RepeatMode): void;

  /**
   * Like the current track.
   */
  toggleLike(): void;

  /**
   * Dislike the current track.
   */
  toggleDislike(): void;

  /**
   * Set the volume.
   */
  setVolume(volume: number): void;

  /**
   * Seek to a time in the current track.
   */
  seekTo(time: number): void;

  /**
   * Start the specified track.
   */
  startTrack(trackId: string, albumId?: string): Promise<void>;

  /**
   * Prepare the controller for use in a session.
   */
  prepareForSession(): Promise<void>;

  /**
   * Get the current player state.
   */
  getPlayerState(): PlayerState | Promise<PlayerState>;

  /**
   *
   */
  getQueue(): Promise<SongInfo[]>;

  /**
   * Check if the controller is ready for use.
   */
  isReady(): boolean;
}
