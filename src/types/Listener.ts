import type { MusicService } from './MusicService';

export interface Listener {
  id: string;
  name: string;
  musicService: MusicService;
  avatarUrl: string;
  trackCount: number;
}
