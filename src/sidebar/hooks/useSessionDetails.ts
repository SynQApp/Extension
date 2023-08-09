import { RepeatMode } from '~types';
import type { SessionDetails } from '~types';

const mockActiveSession: SessionDetails = {
  hostId: '',
  locked: false,
  repeatMode: RepeatMode.NO_REPEAT,
  listeners: []
};

export const useSessionDetails = () => {
  return mockActiveSession;
};
