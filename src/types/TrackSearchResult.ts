import type { Track } from './Track';

export type TrackSearchResult = Pick<
  Track,
  'id' | 'name' | 'artistName' | 'albumCoverUrl'
>;
