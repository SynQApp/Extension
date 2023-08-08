import type { SongInfo } from '.';

export interface QueueItem {
  isPlaying: boolean;
  songInfo: SongInfo;
}
