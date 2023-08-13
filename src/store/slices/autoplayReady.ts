import { createSlice } from '@reduxjs/toolkit';

const autoplayReadySlice = createSlice({
  name: 'autoplayReady',
  initialState: true,
  reducers: {
    setAutoplayReady: (_, action) => action.payload
  }
});

export const { setAutoplayReady } = autoplayReadySlice.actions;

export default autoplayReadySlice.reducer;
