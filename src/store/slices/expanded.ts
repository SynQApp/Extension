import { createSlice } from '@reduxjs/toolkit';

const expandedSlice = createSlice({
  name: 'expanded',
  initialState: false,
  reducers: {
    expand: () => true,
    collapse: () => false
  }
});

export const { expand, collapse } = expandedSlice.actions;

export default expandedSlice.reducer;
