import type { PlayerState, SongInfo } from './PlayerState';

export enum EventMessageType {
  SONG_INFO_UPDATED = 'SONG_INFO_UPDATED',
  PLAYBACK_UPDATED = 'PLAYBACK_UPDATED'
}

export interface SongInfoUpdatedEventBody {
  songInfo: SongInfo;
}

export interface PlaybackUpdatedEventBody {
  playbackState: Omit<PlayerState, 'songInfo'>;
}

export interface QueueUpdatedEventBody {
  queue: SongInfo[];
}
