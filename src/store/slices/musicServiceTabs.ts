import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { MusicServiceTab } from '~types';

const initialState: MusicServiceTab[] = [];

const musicServiceTabsSlice = createSlice({
  name: 'musicServiceTabs',
  initialState: initialState,
  reducers: {
    addMusicServiceTab: (state, action: PayloadAction<MusicServiceTab>) => {
      state.push(action.payload);
    },
    removeMusicServiceTab: (state, action: PayloadAction<number>) => {
      const tabId = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    clearMusicServiceTabs: () => initialState
  }
});

export const {
  addMusicServiceTab,
  removeMusicServiceTab,
  clearMusicServiceTabs
} = musicServiceTabsSlice.actions;

export default musicServiceTabsSlice.reducer;
