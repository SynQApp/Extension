import type {
  NotReadyReason,
  PlayerState,
  QueueItem,
  Track,
  ValueOrPromise
} from '~types';

export interface MusicServicePlaybackController {
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
  toggleRepeatMode(): ValueOrPromise<void>;

  /**
   * Like the current track.
   */
  toggleLike(): ValueOrPromise<void>;

  /**
   * Dislike the current track.
   */
  toggleDislike(): ValueOrPromise<void>;

  /**
   * Toggle the mute state.
   */
  toggleMute(): ValueOrPromise<void>;

  /**
   * Set the volume.
   */
  setVolume(volume: number, relative?: boolean): ValueOrPromise<void>;

  /**
   * Seek to a time in the current track.
   */
  seekTo(time: number): ValueOrPromise<void>;

  /**
   * Prepare the music service UI for autoplay.
   */
  prepareForAutoplay(): ValueOrPromise<void>;

  /**
   * Get the current player state. Returns undefined if the player is not active.
   */
  getPlayerState(): ValueOrPromise<PlayerState | null>;

  /**
   * Get the currently-playing song info.
   */
  getCurrentTrack(): ValueOrPromise<Track | null>;

  /**
   * Get the queue.
   */
  getQueue(): ValueOrPromise<QueueItem[]>;

  /**
   * Check if the controller is ready for use.
   */
  isReady(): ValueOrPromise<true | NotReadyReason>;

  /**
   * Play the item in the queue.
   * @param id The ID of the item to play.
   * @param duplicateIndex If there are multiple items with the same ID, this is the duplicate index of the item to play.
   */
  playQueueTrack(id: string, duplicateIndex?: number): ValueOrPromise<void>;
}
