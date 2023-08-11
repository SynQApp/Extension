import type { QueueItem, RepeatMode } from '.';

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  repeatMode: RepeatMode;
  queue: QueueItem[];
}
