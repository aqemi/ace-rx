import { createSlice } from '@reduxjs/toolkit';

const banManagerSlice = createSlice({
  name: 'banManager',
  initialState: {
    isOpen: false
  },
  reducers: {
    open(state) {
      state.isOpen = true;
    },
    close(state) {
      state.isOpen = false;
    }
  }
});

export const { open, close } = banManagerSlice.actions;
export default banManagerSlice.reducer;
