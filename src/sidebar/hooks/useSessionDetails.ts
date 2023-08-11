import { RepeatMode } from '~types';
import type { Session } from '~types';

const mockActiveSession: Session = {
  hostId: '',
  locked: false,
  repeatMode: RepeatMode.NO_REPEAT,
  listeners: []
};

export const useSessionDetails = () => {
  return mockActiveSession;
};
