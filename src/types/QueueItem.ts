import type { Track } from '.';

export interface QueueItem {
  isPlaying: boolean;
  songInfo: Track;
}
