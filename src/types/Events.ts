import type { PlayerState, SongInfo } from './PlayerState';

export interface SongInfoUpdatedEventBody {
  songInfo: SongInfo;
}

export interface PlaybackUpdatedEventBody {
  playbackState: Omit<PlayerState, 'songInfo'>;
}

export interface QueueUpdatedEventBody {
  queue: SongInfo[];
}
