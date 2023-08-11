import type { Track } from './Track';

export type TrackSearchResult = Pick<
  Track,
  'trackId' | 'trackName' | 'artistName' | 'albumCoverUrl'
>;
