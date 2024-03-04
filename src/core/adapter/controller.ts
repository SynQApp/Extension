import type { ParsedLink } from '~core/links';
import type { PlaybackState, QueueItem, Track, ValueOrPromise } from '~types';

export interface TrackLinkDetails {
  name: string;
  artistName: string;
  duration?: number;
  albumCoverUrl?: string;
  albumName?: string;
}

export type SearchTracksInput = Partial<Pick<Track, 'duration' | 'albumName'>> &
  Pick<Track, 'name' | 'artistName'>;

export interface TrackSearchResult {
  link: string;
  name: string;
  artistName: string;
  duration?: number;
  albumName?: string;
}

export interface AlbumLinkDetails {
  name: string;
  artistName: string;
  albumCoverUrl?: string;
}

export type SearchAlbumsInput = Pick<Track, 'name' | 'artistName'>;

export interface AlbumSearchResult {
  link: string;
  name: string;
  artistName: string;
}

export interface ArtistLinkDetails {
  name: string;
  artistImageUrl?: string;
}

export type SearchArtistsInput = Pick<Track, 'name'>;

export interface ArtistSearchResult {
  link: string;
  name: string;
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
  getPlayerState(): ValueOrPromise<PlaybackState | null>;

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
  getTrackLinkDetails(): ValueOrPromise<TrackLinkDetails | null>;

  /**
   * Get basic track details for current link.
   */
  getAlbumLinkDetails(): ValueOrPromise<AlbumLinkDetails | null>;

  /**
   * Get basic track details for current link.
   */
  getArtistLinkDetails(): ValueOrPromise<ArtistLinkDetails | null>;
}

export interface BackgroundController {
  /**
   * Search for tracks.
   */
  searchTracks(
    searchInput: SearchTracksInput
  ): ValueOrPromise<TrackSearchResult[]>;

  /**
   * Search for albums.
   */
  searchAlbums(
    searchInput: SearchAlbumsInput
  ): ValueOrPromise<AlbumSearchResult[]>;

  /**
   * Search for artists.
   */
  searchArtists(
    searchInput: SearchArtistsInput
  ): ValueOrPromise<ArtistSearchResult[]>;

  /**
   * Parse a link to provide basic track details.
   */
  parseLink(link: string): ParsedLink | null;

  /**
   * Create a link from basic track details.
   */
  getLink(parsedLink: ParsedLink): string;
}
