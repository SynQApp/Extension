import type { MusicService } from '~/types';

export interface Settings {
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  popOutButtonEnabled: boolean;
  preferredMusicService: MusicService;
  redirectsEnabled: boolean;
}
