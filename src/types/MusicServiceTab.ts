import type { MusicService } from './MusicService';
import type { Track } from './Track';

export interface MusicServiceTab {
  musicService: MusicService;
  tabId: number;
  preview: Pick<Track, 'albumCoverUrl' | 'name' | 'artistName'>;
}
