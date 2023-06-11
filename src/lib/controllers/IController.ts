import type { NotReadyReason } from '~types/NotReadyReason';
import type { PlayerState, SongInfo } from '~types/PlayerState';
import type { RepeatMode } from '~types/RepeatMode';

type ValueOrPromise<T> = T | Promise<T>;

export interface IController {
  /**
   * Play the current track.
   */
  play(): ValueOrPromise<void>;

  /**
   * Toggle play/pause.
   */
  playPause(): ValueOrPromise<void>;

  /**
   * Pause the current track.
   */
  pause(): ValueOrPromise<void>;

  /**
   * Skip to the next track.
   */
  next(): ValueOrPromise<void>;

  /**
   * Skip to the previous track.
   */
  previous(): ValueOrPromise<void>;

  /**
   * Set repeat mode.
   */
  setRepeatMode(repeatMode: RepeatMode): ValueOrPromise<void>;

  /**
   * Like the current track.
   */
  toggleLike(): ValueOrPromise<void>;

  /**
   * Dislike the current track.
   */
  toggleDislike(): ValueOrPromise<void>;

  /**
   * Set the volume.
   */
  setVolume(volume: number): ValueOrPromise<void>;

  /**
   * Seek to a time in the current track.
   */
  seekTo(time: number): ValueOrPromise<void>;

  /**
   * Start the specified track.
   */
  startTrack(trackId: string, albumId?: string): ValueOrPromise<void>;

  /**
   * Prepare the controller for use in a session.
   */
  prepareForSession(): ValueOrPromise<void>;

  /**
   * Get the current player state.
   */
  getPlayerState(): ValueOrPromise<PlayerState>;

  /**
   *
   */
  getQueue(): ValueOrPromise<SongInfo[]>;

  /**
   * Check if the controller is ready for use.
   */
  isReady(): ValueOrPromise<true | NotReadyReason>;
}
