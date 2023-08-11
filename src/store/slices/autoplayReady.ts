import { createSlice } from '@reduxjs/toolkit';

import { RepeatMode, type Session } from '~types';

const autoplayReadySlice = createSlice({
  name: 'autoplayReady',
  initialState: false,
  reducers: {
    setAutoplayReady: (_, action) => action.payload
  }
});

export const { setAutoplayReady } = autoplayReadySlice.actions;

export default autoplayReadySlice.reducer;
