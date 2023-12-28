export interface Track {
  id: string;
  name: string;
  artistName: string;
  albumName?: string;
  albumCoverUrl?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  duration: number;
}
