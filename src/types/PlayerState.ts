import type { RepeatMode } from './RepeatMode';

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  repeatMode: RepeatMode;
}

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
