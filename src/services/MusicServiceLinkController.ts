import type { Track, ValueOrPromise } from '~types';

export type GetBasicTrackDetailsResponse = Pick<
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

export interface MusicServiceLinkController {
  /**
   * Get basic track details for current link. Run in MAIN world content script context.
   */
  getBasicTrackDetails(): ValueOrPromise<GetBasicTrackDetailsResponse>;

  /**
   * Get the link for the current track. Run in background service worker context.
   */
  search(searchInput: SearchInput): ValueOrPromise<SearchResult[]>;
}
