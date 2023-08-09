export interface SongInfo {
  trackId: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumCoverUrl: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  duration: number;
}
