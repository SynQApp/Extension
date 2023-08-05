import type { RepeatMode } from './RepeatMode';

export interface SessionDetails {
  hostId: string;
  locked: boolean;
  repeatMode: RepeatMode;
}
