import type { MusicService } from '@synq/music-service-clients';

import type { PlayerState } from './PlayerState';
import type { Track } from './Track';

export interface MusicServiceTab {
  musicService: MusicService;
  tabId: number;
  playerState?: PlayerState;
  currentTrack?: Track | null;
  queue?: Track[];
  pictureInPicture?: boolean;
}
