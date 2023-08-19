import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { MusicService, type Settings } from '~types';

const initialState: Settings = {
  appearance: 'light',
  preferredMusicService: MusicService.APPLE_MUSIC,
  miniPlayerKeyControlsEnabled: true,
  musicServiceKeyControlsEnabled: true,
  notificationsEnabled: true,
  synqLinkPopupsEnabled: true
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setAppearance: (state, action: PayloadAction<Settings['appearance']>) => {
      state.appearance = action.payload;
    },
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
    setSynqLinkPopupsEnabled: (state, action: PayloadAction<boolean>) => {
      state.synqLinkPopupsEnabled = action.payload;
    }
  }
});

export const {
  setAppearance,
  setMiniPlayerKeyControlsEnabled,
  setMusicServiceKeyControlsEnabled,
  setNotificationsEnabled,
  setPreferredMusicService,
  setSynqLinkPopupsEnabled
} = sessionSlice.actions;

export default sessionSlice.reducer;
