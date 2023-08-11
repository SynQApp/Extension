import { createSlice } from '@reduxjs/toolkit';

import type { Session } from '~types';

const initialState: Session | null = null;

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
