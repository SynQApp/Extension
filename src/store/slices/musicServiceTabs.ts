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
    updateMusicServiceTabPlayerState: (
      state,
      action: PayloadAction<{
        tabId: number;
        playerState: MusicServiceTab['playerState'];
      }>
    ) => {
      const { tabId, playerState } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].playerState = playerState;
      }
    },
    updateMusicServiceTabCurrentTrack: (
      state,
      action: PayloadAction<{
        tabId: number;
        currentTrack: MusicServiceTab['currentTrack'];
      }>
    ) => {
      const { tabId, currentTrack } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].currentTrack = currentTrack;
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
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState
} = musicServiceTabsSlice.actions;

export default musicServiceTabsSlice.reducer;
