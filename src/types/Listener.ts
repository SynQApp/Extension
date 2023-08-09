import type { MusicService } from '.';

export interface Listener {
  id: string;
  name: string;
  musicService: MusicService;
  avatarUrl: string;
  trackCount: number;
}
