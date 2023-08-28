import type {
  NotReadyReason,
  PlayerState,
  QueueItem,
  Track,
  TrackSearchResult,
  ValueOrPromise
} from '~types';

export interface MusicController {
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
   * Start the specified track.
   */
  startTrack(trackId: string, albumId?: string): ValueOrPromise<void>;

  prepareForAutoplay(): ValueOrPromise<void>;

  /**
   * Prepare the controller for use in a session.
   */
  prepareForSession(): ValueOrPromise<void>;

  /**
   * Get the current player state. Returns undefined if the player is not active.
   */
  getPlayerState(): ValueOrPromise<PlayerState> | undefined;

  /**
   * Get the currently-playing song info.
   */
  getCurrentTrack(): ValueOrPromise<Track | undefined>;

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

  /**
   * Search for tracks matching the query.
   */
  searchTracks(query: string): Promise<TrackSearchResult[]>;
}
