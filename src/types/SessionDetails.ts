import type { Listener, RepeatMode } from '.';

export interface SessionDetails {
  hostId: string;
  locked: boolean;
  repeatMode: RepeatMode;
  listeners: Listener[];
}
