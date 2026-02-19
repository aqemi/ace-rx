'use strict';

import { createSlice } from '@reduxjs/toolkit';

const logPickerSlice = createSlice({
  name: 'logPicker',
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

export const { open, close } = logPickerSlice.actions;
export default logPickerSlice.reducer;
