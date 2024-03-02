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
        playbackState: MusicServiceTab['playbackState'];
      }>
    ) => {
      const { tabId, playbackState } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].playbackState = playbackState;
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
    updateMusicServiceTabPictureInPicture: (
      state,
      action: PayloadAction<{
        tabId: number;
        pictureInPicture: MusicServiceTab['pictureInPicture'];
      }>
    ) => {
      const { tabId, pictureInPicture } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].pictureInPicture = pictureInPicture;
      }
    },
    updateMusicServiceTabAutoPlayReady: (
      state,
      action: PayloadAction<{
        tabId: number;
        autoPlayReady: MusicServiceTab['autoPlayReady'];
      }>
    ) => {
      const { tabId, autoPlayReady } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].autoPlayReady = autoPlayReady;
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
  updateMusicServiceTabPlayerState,
  updateMusicServiceTabPictureInPicture,
  updateMusicServiceTabAutoPlayReady
} = musicServiceTabsSlice.actions;

export default musicServiceTabsSlice.reducer;
