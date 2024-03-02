import type { QueueItem, RepeatMode } from '.';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  repeatMode: RepeatMode;
  queue: QueueItem[];
}
