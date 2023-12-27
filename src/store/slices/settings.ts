import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type MusicService } from '@synq/music-service-clients';

import { type Settings } from '~types';

const initialState: Settings = {
  miniPlayerKeyControlsEnabled: true,
  musicServiceKeyControlsEnabled: true,
  notificationsEnabled: true,
  popOutButtonEnabled: true,
  preferredMusicService: 'SPOTIFY',
  synqLinkPopupsEnabled: true
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setPreferredMusicService: (state, action: PayloadAction<MusicService>) => {
      state.preferredMusicService = action.payload;
    },
    setMiniPlayerKeyControlsEnabled: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.miniPlayerKeyControlsEnabled = action.payload;
    },
    setMusicServiceKeyControlsEnabled: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.musicServiceKeyControlsEnabled = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    setPopOutButtonEnabled: (state, action: PayloadAction<boolean>) => {
      state.popOutButtonEnabled = action.payload;
    },
    setSynqLinkPopupsEnabled: (state, action: PayloadAction<boolean>) => {
      state.synqLinkPopupsEnabled = action.payload;
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      return action.payload;
    }
  }
});

export const {
  setMiniPlayerKeyControlsEnabled,
  setMusicServiceKeyControlsEnabled,
  setNotificationsEnabled,
  setPopOutButtonEnabled,
  setPreferredMusicService,
  setSynqLinkPopupsEnabled,
  setSettings
} = sessionSlice.actions;

export default sessionSlice.reducer;
