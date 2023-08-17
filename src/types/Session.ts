import type { Listener, RepeatMode, SessionQueueItem } from '.';

export interface Session {
  hostId: string;
  locked: boolean;
  repeatMode: RepeatMode;
  listeners: Listener[];
  tabId: number;
  queue: SessionQueueItem[];
}
