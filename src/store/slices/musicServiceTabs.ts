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
    updateMusicServiceTab: (state, action: PayloadAction<MusicServiceTab>) => {
      const tab = action.payload;
      const index = state.findIndex((t) => t.tabId === tab.tabId);
      if (index !== -1) {
        state[index] = tab;
      } else {
        state.push(tab);
      }
    },
    updateMusicServiceTabPreview: (
      state,
      action: PayloadAction<{
        tabId: number;
        preview: MusicServiceTab['preview'];
      }>
    ) => {
      const { tabId, preview } = action.payload;
      const tab = state.find((tab) => tab.tabId === tabId);
      if (tab) {
        tab.preview = preview;
      }
    },
    clearMusicServiceTabs: () => initialState
  }
});

export const {
  addMusicServiceTab,
  removeMusicServiceTab,
  clearMusicServiceTabs,
  updateMusicServiceTab,
  updateMusicServiceTabPreview
} = musicServiceTabsSlice.actions;

export default musicServiceTabsSlice.reducer;
