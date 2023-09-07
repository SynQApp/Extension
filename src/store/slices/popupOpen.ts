import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

const popupOpenSlice = createSlice({
  name: 'popupOpen',
  initialState: false,
  reducers: {
    setPopupOpen: (_, action: PayloadAction<boolean>) => {
      return action.payload;
    }
  }
});

export const { setPopupOpen } = popupOpenSlice.actions;

export default popupOpenSlice.reducer;
