import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { TrackSearchResult } from '~types';

interface SearchSliceState {
  results: TrackSearchResult[];
  loading: boolean;
}

const initialState: SearchSliceState = {
  results: [],
  loading: false
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<TrackSearchResult[]>) => {
      state.results = action.payload;
      state.loading = false;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSearchResults: () => initialState
  }
});

export const { setSearchResults, setSearchLoading, clearSearchResults } =
  searchSlice.actions;

export default searchSlice.reducer;
