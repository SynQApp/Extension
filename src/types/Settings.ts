import type { ThemeName } from '@synq/ui';

import type { MusicService } from './MusicService';

interface LastFmSettings {
  username: string;
  token: string;
}

export interface Settings {
  appearance: ThemeName;
  preferredMusicService: MusicService;
  miniPlayerKeyControlsEnabled: boolean;
  musicServiceKeyControlsEnabled: boolean;
  notificationsEnabled: boolean;
  synqLinkPopupsEnabled: boolean;
  lastFm?: LastFmSettings;
}
