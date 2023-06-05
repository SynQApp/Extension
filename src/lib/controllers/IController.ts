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
   * Set shuffle.
   */
  toggleShuffle(): void;

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
  startTrack(trackId: string): void;

  /**
   * Prepare the controller for use in a session.
   */
  prepareForSession(): Promise<void>;
}
