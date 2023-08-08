import type { MusicService, QueueItem } from '.';

export interface SessionQueueItem extends QueueItem {
  id: string;
  musicService: MusicService;
}
