import type { Track } from '.';

export interface QueueItem {
  isPlaying: boolean;
  track?: Track | null;
}
