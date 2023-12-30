import type { MusicService } from '@synq/music-service-clients';

export interface Settings {
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  popOutButtonEnabled: boolean;
  preferredMusicService: MusicService;
  redirectsEnabled: boolean;
}
