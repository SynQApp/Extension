import { createSlice } from '@reduxjs/toolkit';

import type { PlayerState } from '~types';

const initialState: PlayerState | null = null;

const currentTrackSlice = createSlice({
  name: 'playerState',
  initialState: initialState,
  reducers: {
    setPlayerState: (_, action) => action.payload,
    clearPlayerState: () => null
  }
});

export const { setPlayerState, clearPlayerState } = currentTrackSlice.actions;

export default currentTrackSlice.reducer;
