import { createSlice } from '@reduxjs/toolkit';

import type { PlayerState } from '~types';

const initialState: PlayerState | null = null;

const playerStateSlice = createSlice({
  name: 'playerState',
  initialState: initialState,
  reducers: {
    setPlayerState: (_, action) => {
      return action.payload;
    },
    clearPlayerState: () => null
  }
});

export const { setPlayerState, clearPlayerState } = playerStateSlice.actions;

export default playerStateSlice.reducer;
