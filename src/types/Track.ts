export interface Track {
  albumCoverUrl?: string;
  albumName?: string;
  artistName: string;
  duration: number;
  id: string;
  isDisliked?: boolean;
  isLiked?: boolean;
  link?: string;
  name: string;
  type?: 'song' | 'podcast';
}
