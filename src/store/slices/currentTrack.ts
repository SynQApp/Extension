import { createSlice } from '@reduxjs/toolkit';

import type { Track } from '~types';

const initialState: Track | null = null;

const currentTrackSlice = createSlice({
  name: 'currentTrack',
  initialState: initialState,
  reducers: {
    setCurrentTrack: (_, action) => action.payload,
    clearCurrentTrack: () => null
  }
});

export const { setCurrentTrack, clearCurrentTrack } = currentTrackSlice.actions;

export default currentTrackSlice.reducer;
