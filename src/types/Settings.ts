import type { MusicService } from '@synq/music-service-clients';

export interface Settings {
  preferredMusicService: MusicService;
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  synqLinkPopupsEnabled: boolean;
}
