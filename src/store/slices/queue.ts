import { createSlice } from '@reduxjs/toolkit';

import type { QueueItem } from '~types';

const initialState: QueueItem[] = [];

const queueSlice = createSlice({
  name: 'queue',
  initialState: initialState,
  reducers: {
    setQueue: (_, action) => action.payload,
    clearQueue: () => []
  }
});

export const { setQueue, clearQueue } = queueSlice.actions;

export default queueSlice.reducer;
