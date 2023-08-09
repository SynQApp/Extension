import type { SongInfo } from './SongInfo';

export type TrackSearchResult = Pick<
  SongInfo,
  'trackId' | 'trackName' | 'artistName' | 'albumCoverUrl'
>;
