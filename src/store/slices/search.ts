import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { TrackSearchResult } from '~types';

interface SearchSliceState {
  results: TrackSearchResult[];
  loading: boolean;
}

const initialState: SearchSliceState | null = null;

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    setResults: (state, action: PayloadAction<TrackSearchResult[]>) => {
      state.results = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setResults, setLoading } = searchSlice.actions;

export default searchSlice.reducer;
