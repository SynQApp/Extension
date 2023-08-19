import type { MusicService } from './MusicService';

interface LastFmSettings {
  username: string;
  token: string;
}

export interface Settings {
  appearance: 'light' | 'dark';
  preferredMusicService: MusicService;
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  synqLinkPopupsEnabled: boolean;
  lastFm?: LastFmSettings;
}
