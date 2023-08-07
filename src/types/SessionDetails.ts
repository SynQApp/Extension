import type { Listener } from './Listener';
import type { RepeatMode } from './RepeatMode';

export interface SessionDetails {
  hostId: string;
  locked: boolean;
  repeatMode: RepeatMode;
  listeners: Listener[];
}
