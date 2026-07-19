import { createSlice } from '@reduxjs/toolkit';

const adminLoginSlice = createSlice({
  name: 'adminLogin',
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

export const { open, close } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
