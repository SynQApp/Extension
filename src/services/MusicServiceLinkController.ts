import type { Track, ValueOrPromise } from '~types';

export type GetBasicTrackDetailsResponse = Pick<
  Track,
  'name' | 'artistName' | 'duration' | 'albumCoverUrl' | 'albumName'
> | null;

export type GetLinkInput = Partial<Pick<Track, 'duration' | 'albumName'>> &
  Pick<Track, 'name' | 'artistName'>;

export interface MusicServiceLinkController {
  /**
   * Get basic track details for current link. Run in MAIN world content script context.
   */
  getBasicTrackDetails(): ValueOrPromise<GetBasicTrackDetailsResponse>;

  /**
   * Get the link for the current track. Run in background service worker context.
   */
  getLink(basicTrackDetails: GetLinkInput): ValueOrPromise<string | null>;
}
