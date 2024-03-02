import type { MusicService } from '~/types';

import type { PlaybackState } from './PlayerState';
import type { Track } from './Track';

export interface MusicServiceTab {
  musicService: MusicService;
  tabId: number;
  playbackState?: PlaybackState | null;
  currentTrack?: Track | null;
  queue?: Track[];
  pictureInPicture?: boolean;
}
