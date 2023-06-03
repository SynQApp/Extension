export interface IController {
  /**
   * Play the current track.
   */
  play(): void

  /**
   * Toggle play/pause.
   */
  playPause(): void

  /**
   * Pause the current track.
   */
  pause(): void

  /**
   * Skip to the next track.
   */
  next(): void

  /**
   * Skip to the previous track.
   */
  previous(): void

  /**
   * Set shuffle.
   */
  setShuffle(shuffle: boolean): void

  /**
   * Like the current track.
   */
  like(): void

  /**
   * Dislike the current track.
   */
  dislike(): void

  /**
   * Set the volume.
   */
  setVolume(volume: number): void

  /**
   * Seek to a time in the current track.
   */
  seekTo(time: number): void

  /**
   * Start the specified track.
   */
  startTrack(trackId: string): void
}
