import type { PlayerState, QueueItem, Track, ValueOrPromise } from '~types';

export type LinkTrack = Pick<
  Track,
  'name' | 'artistName' | 'duration' | 'albumCoverUrl' | 'albumName'
> | null;

export type SearchInput = Partial<Pick<Track, 'duration' | 'albumName'>> &
  Pick<Track, 'name' | 'artistName'>;

export interface SearchResult {
  link: string;
  name: string;
  artistName: string;
  duration?: number;
  albumName?: string;
}

export interface ContentController {
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
   * Play the item in the queue.
   * @param id The ID of the item to play.
   * @param duplicateIndex If there are multiple items with the same ID, this is the duplicate index of the item to play.
   */
  playQueueTrack(id: string, duplicateIndex?: number): ValueOrPromise<void>;

  /**
   * Get basic track details for current link.
   */
  getLinkTrack(): ValueOrPromise<LinkTrack>;
}

export interface BackgroundController {
  /**
   * Get the link for the current track.
   */
  search(searchInput: SearchInput): ValueOrPromise<SearchResult[]>;
}
