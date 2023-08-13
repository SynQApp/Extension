import type { Listener, RepeatMode } from '.';

export interface Session {
  hostId: string;
  locked: boolean;
  repeatMode: RepeatMode;
  listeners: Listener[];
  tabId: number;
}
