import type { MusicService } from './MusicService';

export interface Settings {
  preferredMusicService: MusicService;
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  synqLinkPopupsEnabled: boolean;
}
