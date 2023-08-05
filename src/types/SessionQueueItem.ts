import type { MusicService } from './MusicService';
import type { QueueItem } from './PlayerState';

export interface SessionQueueItem extends QueueItem {
  id: string;
  musicService: MusicService;
}
