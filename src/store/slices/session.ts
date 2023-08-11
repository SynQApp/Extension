import { createSlice } from '@reduxjs/toolkit';

import { RepeatMode, type Session } from '~types';

const mockActiveSession: Session = {
  hostId: '',
  locked: false,
  repeatMode: RepeatMode.NO_REPEAT,
  listeners: [],
  tabId: 0
};

const initialState: Session | null = mockActiveSession;

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setSession: (_, action) => action.payload,
    clearSession: () => null
  }
});

export const { setSession, clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
