import { RepeatMode } from '~types/RepeatMode';
import type { SessionDetails } from '~types/SessionDetails';

const mockActiveSession: SessionDetails = {
  hostId: '',
  locked: false,
  repeatMode: RepeatMode.NO_REPEAT,
  listeners: []
};

export const useSessionDetails = () => {
  return mockActiveSession;
};
