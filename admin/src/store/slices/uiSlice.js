import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  toast: null, // { message: string, type: 'success' | 'error' | 'info' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload; // { message, type }
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
